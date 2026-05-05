# 环境变量说明文档 (ENV_VARS.md)

## 必填环境变量

### 1. MONGODB_URI
- **说明**: MongoDB 数据库连接字符串
- **获取方式**: 
  1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas/database)
  2. 创建免费集群 (M0 Sandbox)
  3. 在 Clusters → Connect 中获取连接字符串
  4. 替换 `<password>` 为数据库用户密码
- **示例**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-data-marketplace`
- **位置**: backend/.env

### 2. JWT_SECRET
- **说明**: JWT 令牌签名密钥，用于用户认证
- **生成方式**: 使用以下命令生成随机密钥
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **示例**: `a1b2c3d4e5f6...` (64位十六进制字符串)
- **位置**: backend/.env
- **重要性**: 高 - 用于签发和验证用户登录令牌

### 3. STRIPE_SECRET_KEY
- **说明**: Stripe 支付网关密钥 (服务端)
- **获取方式**:
  1. 注册 [Stripe](https://stripe.com/) 账号
  2. 进入 Developers → API keys
  3. 复制 Secret key (sk_live_... 或 sk_test_your_stripe_secret_key_here...)
- **示例**: `sk_test_your_stripe_secret_key_here`
- **位置**: backend/.env

### 4. STRIPE_PUBLISHABLE_KEY
- **说明**: Stripe 支付公钥 (客户端)
- **获取方式**: 与 STRIPE_SECRET_KEY 同一页面获取
- **示例**: `pk_test_your_stripe_publishable_key_here`
- **位置**: backend/.env, frontend/.env.local

### 5. NEXT_PUBLIC_API_URL
- **说明**: 后端 API 服务地址
- **本地开发**: `http://localhost:3001`
- **Vercel 部署**: `https://your-project.vercel.app`
- **位置**: frontend/.env.local

---

## Vercel 环境变量配置步骤

### 方式一: 通过 Vercel Dashboard

1. 登录 [Vercel](https://vercel.com/dashboard)
2. 选择你的项目 → Settings → Environment Variables
3. 逐个添加以下变量:

| Name | Value | Environments |
|------|-------|--------------|
| MONGODB_URI | mongodb+srv://... | Production, Development |
| JWT_SECRET | (生成的密钥) | Production, Development |
| STRIPE_SECRET_KEY | sk_test_your_stripe_secret_key_here... | Production, Development |
| STRIPE_PUBLISHABLE_KEY | pk_test_your_stripe_publishable_key_here... | Production, Development |
| NEXT_PUBLIC_API_URL | https://your-app.vercel.app | Production |
| NEXT_PUBLIC_API_URL | http://localhost:3001 | Development |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_test_your_stripe_publishable_key_here... | Production, Development |

### 方式二: 通过 vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 进入项目目录
cd AI数据交易市场

# 添加环境变量
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# 部署
vercel --prod
```

---

## 本地开发 .env 示例

创建 `backend/.env` 文件:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-data-marketplace

# JWT
JWT_SECRET=your-64-char-random-secret-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Server
PORT=3001
NODE_ENV=development
```

创建 `frontend/.env.local` 文件:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

---

## 注意事项

1. **安全性**: 切勿将 `.env` 文件提交到 Git 仓库
2. **密钥区分**: 
   - `STRIPE_SECRET_KEY` (sk_) 仅用于后端
   - `STRIPE_PUBLISHABLE_KEY` (pk_) 可用于前端
3. **测试与生产**: 建议先使用 Stripe Test Keys 开发调试
4. **MongoDB Atlas 免费版限制**: 
   - 最大 512MB 存储
   - 共享内存
   - 无自动备份 (需手动)

---

## 验证配置

部署后可通过访问 `/api/health` 端点验证后端是否正常运行:

```bash
curl https://your-app.vercel.app/api/health
```

预期响应:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
