# GitHub + Vercel 部署步骤

本文档详细说明如何将 AI 数据交易市场项目上传到 GitHub 并部署到 Vercel。

---

## 目录

1. [创建 GitHub 仓库](#1-创建-github-仓库)
2. [手机端上传代码方法](#2-手机端上传代码方法)
3. [Vercel 导入部署](#3-vercel-导入部署)
4. [环境变量配置](#4-环境变量配置)
5. [验证部署](#5-验证部署)
6. [常见问题](#6-常见问题)

---

## 1. 创建 GitHub 仓库

### 电脑端操作

#### 步骤 1: 创建新仓库

1. 登录 [GitHub](https://github.com/)
2. 点击右上角 **+** → **New repository**
3. 填写信息:
   - **Repository name**: `ai-data-marketplace`
   - **Description**: `AI 数据交易市场 - 数据交易平台`
   - **Visibility**: Public (公开) / Private (私有)
   - ⚠️ **不要勾选** "Add a README file"
   - ⚠️ **不要选择** .gitignore (稍后添加)

4. 点击 **Create repository**

#### 步骤 2: 初始化本地仓库

```bash
# 进入项目目录
cd AI数据交易市场

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Data Marketplace"

# 添加远程仓库 (替换 YOUR_USERNAME 为你的 GitHub 用户名)
git remote add origin https://github.com/YOUR_USERNAME/ai-data-marketplace.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 2. 手机端上传代码方法

### 方法一: 使用 GitHub App

#### 步骤 1: 准备 ZIP 文件

1. 在电脑端压缩项目文件夹为 `ai-data-marketplace.zip`
2. 将 ZIP 文件上传到手机 (可通过微信/QQ/百度网盘传输)

#### 步骤 2: 使用 GitHub App

1. 手机应用商店下载 **GitHub** App
2. 登录账号
3. 点击 **+** → **Add repository** → **Import a repository**
4. 填写:
   - Your old repository's clone URL: 留空
   - New repository name: `ai-data-marketplace`
5. ⚠️ 注意: GitHub App 导入功能需要原始仓库 URL

### 方法二: 使用网页版 GitHub

1. 手机浏览器打开 [github.com](https://github.com/)
2. 登录账号
3. 创建新仓库 (同电脑端步骤)
4. 上传文件:
   - 进入仓库页面
   - 点击 **Add file** → **Upload files**
   - 选择本地解压的项目文件夹
   - ⚠️ 由于 GitHub 网页单次上传限制，建议分文件夹上传

### 方法三: 使用 Working Copy App (iOS)

1. App Store 下载 **Working Copy** (免费)
2. 克隆仓库:
   ```
   git clone https://github.com/YOUR_USERNAME/ai-data-marketplace.git
   ```
3. 将项目文件复制到 App 的 Documents 文件夹
4. 使用 Working Copy 进行提交和推送

### 方法四: 使用 Termux (Android)

1. 手机应用商店下载 **Termux** App
2. 安装 Git:
   ```bash
   pkg update && pkg install git
   ```
3. 配置 Git:
   ```bash
   git config --global user.name "你的用户名"
   git config --global user.email "你的邮箱"
   ```
4. 克隆并操作:
   ```bash
   # 如果已创建空仓库
   git clone https://github.com/YOUR_USERNAME/ai-data-marketplace.git
   cd ai-data-marketplace
   # 手动复制文件后
   git add .
   git commit -m "Initial commit"
   git push
   ```

---

## 3. Vercel 导入部署

### 方式一: Vercel Dashboard 导入

#### 步骤 1: 连接 GitHub

1. 登录 [Vercel](https://vercel.com/dashboard)
2. 点击 **Add New** → **Project**
3. 选择 **Import Git Repository**
4. 授权 GitHub 访问 (如果首次使用)
5. 选择 `ai-data-marketplace` 仓库

#### 步骤 2: 配置项目

在 Configure Project 页面:

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Next.js |
| Root Directory | `./` |
| Build Command | `npm run build` (自动检测) |
| Output Directory | `frontend/.next` (自动检测) |

#### 步骤 3: 环境变量

点击 **Environment Variables**，添加以下变量:

| Name | Value | Environments |
|------|-------|--------------|
| MONGODB_URI | `mongodb+srv://...` | Production, Development |
| JWT_SECRET | `your-secret-key` | Production, Development |
| STRIPE_SECRET_KEY | `sk_test_...` | Production, Development |
| STRIPE_PUBLISHABLE_KEY | `pk_test_...` | Production, Development |
| NEXT_PUBLIC_API_URL | `https://your-app.vercel.app` | Production |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | `pk_test_...` | Production, Development |

#### 步骤 4: 部署

1. 点击 **Deploy**
2. 等待构建完成 (约 2-3 分钟)
3. 获得部署 URL: `https://your-project.vercel.app`

### 方式二: Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 进入项目目录
cd AI数据交易市场

# 开发环境预览
vercel

# 生产环境部署
vercel --prod
```

---

## 4. 环境变量配置

详细环境变量说明请查看 [ENV_VARS.md](./ENV_VARS.md)

### 快速获取 MongoDB Atlas 连接字符串

1. 访问 https://www.mongodb.com/atlas/database
2. 创建免费账户/登录
3. 创建免费集群 (M0)
4. Clusters → Connect → Connect your application
5. 复制连接字符串
6. 替换 `<password>` 为你的数据库用户密码

### 生成 JWT_SECRET

```bash
# Node.js 生成
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 获取 Stripe Keys

1. 注册 https://stripe.com/
2. Developers → API keys
3. 获取 Test 模式的密钥 (sk_test_, pk_test_)

---

## 5. 验证部署

### 检查前端

访问 `https://your-project.vercel.app`

预期:
- ✅ 显示首页
- ✅ 可以注册/登录

### 检查后端 API

```bash
curl https://your-project.vercel.app/api/health
```

预期响应:
```json
{
  "status": "ok",
  "message": "AI Data Marketplace API is running"
}
```

### 自定义域名 (可选)

1. Vercel Dashboard → 项目 → Settings → Domains
2. 添加你的域名
3. 按提示配置 DNS 记录

---

## 6. 常见问题

### Q1: 部署后页面空白

**原因**: 环境变量未配置或配置错误

**解决**:
1. 检查 NEXT_PUBLIC_API_URL 是否正确
2. 确认 MongoDB_URI 格式正确
3. 重新部署: Deployments → ... → Redeploy

### Q2: API 请求失败

**原因**: 后端环境变量缺失

**解决**:
1. 检查 STRIPE_SECRET_KEY 是否配置
2. 确认 JWT_SECRET 已设置
3. 查看 Vercel Function 日志排查

### Q3: MongoDB 连接失败

**可能原因**:
- 网络 IP 未加入白名单
- 用户名/密码错误
- 连接字符串格式错误

**解决**:
1. MongoDB Atlas → Network Access → Allow Access from Anywhere
2. 检查连接字符串格式

### Q4: Stripe 无法支付

**原因**: 使用了测试密钥但测试数据配置错误

**解决**:
1. 确认使用 Stripe Test Keys
2. 使用 Stripe 官方测试卡:
   - 卡号: 4242 4242 4242 4242
   - 有效期: 任意未来日期
   - CVC: 任意3位数字

### Q5: 如何更新代码?

```bash
# 本地修改后
git add .
git commit -m "Update: 你的修改描述"
git push

# Vercel 会自动检测并重新部署
```

---

## 项目结构

```
ai-data-marketplace/
├── .gitignore
├── vercel.json
├── ENV_VARS.md
├── README.md
├── docs/
│   └── GitHub+Vercel部署步骤.md
├── frontend/                 # Next.js 前端
│   ├── package.json
│   ├── next.config.js
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── ...
└── backend/                  # Express 后端
    ├── package.json
    ├── src/
    │   ├── index.js
    │   ├── routes/
    │   ├── middleware/
    │   └── models/
    └── ...
```

---

## 技术支持

- Vercel 文档: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Stripe: https://stripe.com/docs

---

*最后更新: 2024年*
