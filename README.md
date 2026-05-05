# AI Data Marketplace

一个现代化的 AI 数据交易平台，支持数据上传、交易、支付和企业级功能。

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **后端**: Express.js + MongoDB + JWT + Stripe
- **部署**: Vercel (Frontend + Serverless Functions)

## 项目结构

```
ai-data-marketplace/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # 页面组件
│   │   ├── components/      # UI 组件
│   │   ├── lib/             # 工具函数
│   │   └── types/           # TypeScript 类型定义
│   └── package.json
├── backend/                  # Express 后端 API
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── middleware/       # 中间件
│   │   └── index.js         # 入口文件
│   └── package.json
├── docs/                     # 文档
├── .gitignore
├── vercel.json              # Vercel 部署配置
├── ENV_VARS.md              # 环境变量说明
└── README.md
```

## 快速开始

### 本地开发

1. 克隆仓库
```bash
git clone https://github.com/YOUR_USERNAME/ai-data-marketplace.git
cd ai-data-marketplace
```

2. 安装依赖
```bash
# 前端依赖
cd frontend && npm install

# 后端依赖
cd ../backend && npm install
```

3. 配置环境变量
```bash
# backend/.env
cp backend/.env.example backend/.env
# 编辑 backend/.env 填入你的配置

# frontend/.env.local
cp frontend/.env.example frontend/.env.local
# 编辑 frontend/.env.local 填入你的配置
```

4. 启动服务
```bash
# 终端1: 启动后端
cd backend && npm run dev

# 终端2: 启动前端
cd frontend && npm run dev
```

5. 访问 http://localhost:3000

### Vercel 部署

详细步骤请查看 [GitHub+Vercel部署步骤.md](./docs/GitHub+Vercel部署步骤.md)

## 功能特性

- ✅ 用户注册/登录 (JWT认证)
- ✅ 数据集上传与管理
- ✅ Stripe 支付集成
- ✅ 交易记录与收益统计
- ✅ 企业数据市场
- ✅ 响应式设计

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| MONGODB_URI | MongoDB 连接字符串 | ✅ |
| JWT_SECRET | JWT 签名密钥 | ✅ |
| STRIPE_SECRET_KEY | Stripe 服务端密钥 | ✅ |
| STRIPE_PUBLISHABLE_KEY | Stripe 客户端密钥 | ✅ |
| NEXT_PUBLIC_API_URL | 后端 API 地址 | ✅ |

详细说明请查看 [ENV_VARS.md](./ENV_VARS.md)

## 许可证

MIT License
