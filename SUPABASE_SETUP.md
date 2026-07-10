# Supabase 项目接入指引

> 本文档说明如何将 [supabase/migrations/](supabase/migrations/) 下的 SQL 部署到 Supabase 项目，并接入 Next.js 应用。

---

## 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com) 注册/登录
2. 点击 **New Project**，填写：
   - Name: `retro-game-wiki`
   - Database Password: 自行设置强密码并保存
   - Region: 选择离用户最近的区域（如 Northeast Asia - Tokyo / Singapore）
3. 等待项目初始化完成（约 2 分钟）

---

## 2. 执行数据库 Migration

进入项目的 **SQL Editor**，按顺序执行以下 6 个文件：

| 顺序 | 文件 | 说明 |
|------|------|------|
| 1 | [001_platforms.sql](supabase/migrations/001_platforms.sql) | 平台表 + 类型表 + 初始数据（10 平台 + 12 类型） |
| 2 | [002_games.sql](supabase/migrations/002_games.sql) | 游戏主表 + 平台关系 + 类型关系 |
| 3 | [003_guides.sql](supabase/migrations/003_guides.sql) | 攻略表 + 攻略章节表 |
| 4 | [004_game_entities.sql](supabase/migrations/004_game_entities.sql) | 角色 / Boss / 道具 / 秘籍 / 模拟器教程 |
| 5 | [005_seo_and_meta.sql](supabase/migrations/005_seo_and_meta.sql) | SEO / 媒体 / 标签 / 新闻 / 后台设置 |
| 6 | [006_remove_ai_generations.sql](supabase/migrations/006_remove_ai_generations.sql) | 移除 ai_generations 表（AI 模块已废弃，改用本地 AI 工具辅助） |

**执行方式**：
1. 打开 SQL Editor
2. 复制每个 SQL 文件内容粘贴
3. 点击 **Run** 执行
4. 确认无报错后执行下一个

> 必须按顺序执行，后续表依赖前面表的外键。

执行后验证：在 Table Editor 应看到 17 张表，platforms 和 genres 表各有初始数据。

---

## 3. 获取 API 密钥

进入 **Project Settings → API**，记录以下信息：

| 配置项 | 用途 | 说明 |
|--------|------|------|
| `Project URL` | 项目地址 | 形如 `https://xxxxx.supabase.co` |
| `anon public` key | 浏览器端 | 公开密钥，受 RLS 策略限制 |
| `service_role` key | 服务端 | **私密**，绕过 RLS，仅用于 Server Actions |

> ⚠️ `service_role` key 绝不能暴露到浏览器端。

---

## 4. 配置环境变量

在项目根目录创建 `.env.local` 文件（已被 .gitignore 忽略）：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # 仅服务端使用

# 站点
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

同时创建 `.env.example` 作为模板（可提交到 git）：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 5. 表结构概览（17 张表）

```
平台与类型
├── platforms          平台（含 10 条初始数据）
├── genres             游戏类型（含 12 条初始数据）

游戏核心
├── games              游戏主表
├── game_platforms     游戏↔平台（多对多）
├── game_genres        游戏↔类型（多对多）

攻略系统
├── guides             攻略
├── guide_sections     攻略章节（可选）

游戏资料
├── characters         角色
├── bosses             Boss
├── items              道具
├── cheats             秘籍
├── emulator_guides    模拟器教程

元数据与扩展
├── seo_metadata       SEO（唯一数据源）
├── media              媒体资源
├── tags               标签
├── game_tags          游戏↔标签（多对多）
├── news               新闻
└── admin_settings     后台设置
```

> ai_generations 表已通过 [006_remove_ai_generations.sql](supabase/migrations/006_remove_ai_generations.sql) 移除，AI 内容生产改为使用本地 AI 工具辅助。

设计文档：[docs/02-database-schema.md](docs/02-database-schema.md)
修订记录：[DATABASE_REVISIONS.md](DATABASE_REVISIONS.md)

---

## 6. 下一步

完成以上步骤后，通知 AI 继续开发：
- `lib/supabaseClient.ts`（Supabase 客户端封装）
- `lib/queries/`（数据访问层）
- 前端页面接入数据库

---

## 7. RLS 策略（待后续阶段补充）

当前 migration 未包含 Row Level Security 策略。MVP 阶段先用 Supabase 默认行为：
- `anon` 角色：可读 published 内容，不可写
- `service_role`：完全访问（后台操作走此 key）

后续阶段会在 migration 中补充 RLS 策略文件。
