# Retro Game Wiki

中文经典游戏百科站 — 攻略 Wiki / 模拟器资料 / 游戏数据库

## 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **样式**: Tailwind CSS v4
- **代码规范**: ESLint
- **数据库**: Supabase PostgreSQL（待接入）
- **部署**: Vercel + Cloudflare

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

开发服务器地址：[http://localhost:3000](http://localhost:3000)

## 项目结构

```
retro-game-wiki/
├── app/              # Next.js App Router 页面
├── components/       # React 组件（待创建）
├── lib/              # 工具函数与数据访问层（待创建）
├── types/            # TypeScript 类型定义（待创建）
├── hooks/            # React Hooks（待创建）
├── public/           # 静态资源
├── docs/             # 项目设计文档
└── supabase/         # 数据库 migration（待创建）
```

## 项目文档

所有设计文档在 `docs/` 目录下：

| 编号 | 文档 | 说明 |
|------|------|------|
| 01 | project-spec | 项目整体规格 |
| 02 | database-schema | 数据库设计 |
| 03 | ai-coding-roadmap | 开发路线图 |
| 04 | content-strategy | 内容战略 |
| 05 | ai-agent-rules | AI 开发规范 |
| 06 | mvp-content-list | MVP 内容清单 |
| 07 | seo-architecture | SEO 架构 |
| 08 | deployment-and-operation | 部署运营方案 |

项目分析报告见 [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)

## 开发阶段

详见 [docs/03-ai-coding-roadmap.md](docs/03-ai-coding-roadmap.md)

当前进度：**Phase 0 项目初始化** ✅

第一阶段目标：MVP 上线（基础网站 + 后台 CMS + 首批内容）
