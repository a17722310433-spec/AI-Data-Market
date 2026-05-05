# DataChain 部署指南

本指南将帮助您将DataChain AI数据交易市场部署到生产环境。

## 📋 部署前准备

### 系统要求

- **操作系统**：Ubuntu 20.04+ / CentOS 8+ / macOS
- **Node.js**：18.x 或更高版本
- **RAM**：至少 2GB（推荐 4GB+）
- **磁盘空间**：至少 20GB

### 必要服务

1. **MongoDB**
   - 本地部署或使用 MongoDB Atlas 云服务
   - 推荐配置：副本集以保证高可用

2. **Stripe 账户**
   - 注册 Stripe 开发者账户
   - 获取 API 密钥（测试/生产）

3. **OpenAI API**（可选，用于AI评估）
   - 注册 OpenAI 账户
   - 获取 API 密钥

4. **域名与SSL证书**
   - 建议使用 Nginx + Let's Encrypt

## 🐳 Docker 部署（推荐）

### 1. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:6.0
    container_name: datachain-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your_password
      MONGO_INITDB_DATABASE: datachain
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - datachain-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: datachain-backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGODB_URI: mongodb://admin:your_password@mongodb:27017/datachain?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key
      JWT_EXPIRES_IN: 7d
      STRIPE_SECRET_KEY: sk_live_xxxxx
      STRIPE_WEBHOOK_SECRET: whsec_xxxxx
      STRIPE_PLATFORM_FEE_PERCENT: 10
      OPENAI_API_KEY: sk-xxxxx
      FRONTEND_URL: https://yourdomain.com
    ports:
      - "3001:3001"
    depends_on:
      - mongodb
    networks:
      - datachain-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: datachain-frontend
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: https://api.yourdomain.com
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_xxxxx
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - datachain-network

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    container_name: datachain-nginx
    restart: always
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - datachain-network

volumes:
  mongodb_data:

networks:
  datachain-network:
    driver: bridge
```

### 2. 创建后端 Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "src/index.js"]
```

### 3. 创建前端 Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
    npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 4. 创建 Nginx 配置

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Frontend
        location / {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # API Backend
        location /api {
            limit_req zone=api burst=50 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Webhooks (Stripe)
        location /api/payments/webhook {
            limit_req zone=api burst=100 nodelay;
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Content-Type application/json;
        }
    }
}
```

### 5. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

## ☁️ 云平台部署

### Vercel（前端推荐）

```bash
cd frontend
vercel
```

### Railway（后端推荐）

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### AWS / GCP / Azure

1. 创建虚拟机/容器实例
2. 安装 Docker
3. 使用上述 docker-compose 配置

## 🔧 生产环境配置

### 1. 环境变量

```bash
# backend/.env (生产)
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://user:pass@host:27017/datachain
JWT_SECRET=your-very-long-random-secret-key-here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PLATFORM_FEE_PERCENT=10
OPENAI_API_KEY=sk-xxxxx
FRONTEND_URL=https://yourdomain.com

# frontend/.env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 2. MongoDB 安全配置

```javascript
// 生产环境建议启用认证
// mongod.conf
security:
  authorization: enabled
```

### 3. Stripe Webhook 配置

在 Stripe Dashboard 中配置 Webhook 端点：
```
https://api.yourdomain.com/api/payments/webhook
```

监听事件：
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## 🔒 安全检查清单

- [ ] 所有API使用HTTPS
- [ ] JWT密钥足够复杂且安全存储
- [ ] MongoDB启用认证
- [ ] Stripe使用生产密钥
- [ ] 配置文件不在版本控制中
- [ ] 启用速率限制
- [ ] 配置安全HTTP头
- [ ] 定期更新依赖

## 📊 监控与日志

### 使用 Winston 日志

后端已集成 Winston 日志，支持：
- 控制台输出（开发环境）
- 文件输出（生产环境）

### 推荐监控工具

- **Sentry**：错误追踪
- **Datadog**：应用监控
- **Prometheus + Grafana**：指标可视化

## 🔄 更新与维护

### 更新代码

```bash
# 拉取最新代码
git pull origin main

# 重新构建
docker-compose build

# 重启服务
docker-compose up -d
```

### 数据库备份

```bash
# MongoDB 备份
mongodump --uri="mongodb://user:pass@host:27017/datachain" --out=/backup/path

# 恢复
mongorestore --uri="mongodb://user:pass@host:27017/datachain" /backup/path
```

## 🆘 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查网络连接
   - 验证用户名密码
   - 确认IP白名单

2. **Stripe webhook不工作**
   - 检查 webhook URL
   - 验证 webhook secret
   - 查看 Stripe 日志

3. **前端构建失败**
   - 检查环境变量
   - 清理缓存：`rm -rf .next`
   - 重新安装依赖

## 📞 支持

如有问题，请提交 Issue 或联系 support@datachain.io
