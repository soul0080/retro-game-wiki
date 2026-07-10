# Retro Game Wiki 项目分析报告

> 由项目首席技术负责人基于 `docs/` 下 8 份设计文档编写
> 版本：v1.0
> 日期：2026-07-09
> 性质：正式开发前的整体评估与决策清单，不修改任何已有文件

---

## 1. 项目目标总结

### 1.1 一句话定位

> 面向中文玩家的**经典游戏知识库**，通过结构化数据库 + 攻略 Wiki + 模拟器教程，借助 SEO 与广告实现长期流量变现。

### 1.2 核心特征

| 维度 | 取舍 |
|------|------|
| 内容形态 | **非新闻站**，做生命周期 10 年以上的长期资产 |
| 用户群体 | 怀旧玩家（25-45 岁）、年轻玩家、收藏玩家 |
| 内容方向 | 怀旧游戏 / 模拟器 / RPG 攻略 / 经典主机资料 |
| 商业模式 | Google AdSense 为主 → 联盟营销 → 商业专题 |
| 运营方式 | 个人长期运营，借助本地 AI 工具辅助内容生产 |

### 1.3 长期愿景

建立「中文最大经典游戏知识数据库」，最终形成：

```
数据库沉淀资产 → SEO 流量 → 广告收入 → 反哺内容
```

### 1.4 量化目标（第一年）

- 内容：500+ 游戏 / 30000+ 页面
- SEO：Google/Baidu 收录 50000+
- 流量：日 UV 10000+
- 收益：覆盖服务器成本，形成稳定副收入

---

## 2. 技术架构总结

### 2.1 架构总览

```
用户
 ↓
Cloudflare CDN
 ↓
Vercel (Next.js)
 ↓
Supabase ── PostgreSQL / Storage / Auth
```

### 2.2 技术栈选型

| 层 | 选型 | 关键约束 |
|----|------|----------|
| 前端 | Next.js 15+ App Router / TypeScript / Tailwind / shadcn/ui | Server Component 优先，page.tsx ≤ 300 行 |
| 后端 | Next.js Server Actions + Supabase API | 不独立部署后端，降低复杂度 |
| 数据库 | Supabase PostgreSQL | UUID 主键 / JSONB / FTS |
| 存储 | Supabase Storage | 封面、截图、地图 |
| 搜索 | 阶段1：PostgreSQL FTS → 阶段2：Elasticsearch | |
| 缓存 | Redis（后期） | 热门页缓存 |
| 部署 | Vercel + Cloudflare + Supabase | 免费起步，月成本 < $20 |
| 图片 | 强制 Next/Image | WebP / Lazy Loading |

### 2.3 前端架构规则

- 目录：`app/ components/ lib/ hooks/ types/`
- 组件命名：PascalCase；工具文件：camelCase；页面目录：小写
- 性能：Server Component 优先，减少客户端 JS
- API 统一返回 `{ success, data | error }`

### 2.4 数据安全规则

- 禁止前端直接写数据库
- 流程：用户 → Server Action → Database
- `/admin` 必须登录验证

---

## 3. 数据库设计总结

### 3.1 设计哲学

**Game 是中心实体**，所有内容围绕 Game 展开：

```
Platform ←→ Game → Guide / Character / Boss / Item / Cheat / EmulatorGuide / Media / SEO
```

### 3.2 表清单（共约 18 张）

| 类别 | 表 | 说明 |
|------|-----|------|
| 核心 | platforms, games, game_platforms, genres, game_genres | 平台与游戏多对多 |
| 内容 | guides, guide_sections, characters, bosses, items, cheats | 游戏资料实体 |
| 模拟器 | emulator_guides | 独立教程 |
| 媒体 | media | 统一图片管理（entity_type + entity_id） |
| 新闻 | news | 独立于 Wiki |
| 标签 | tags, game_tags | 专题用 |
| SEO | seo_metadata | 统一 SEO 字段 |
| 管理 | admin_settings | 站点名/广告/统计代码 |

### 3.3 命名与字段规范

- 表名：复数英文（games, guides）
- 字段：snake_case（release_year, created_at）
- 主键：统一 UUID
- 时间：统一 created_at / updated_at
- 内容状态：draft / review / published / archived

### 3.4 数据规模规划

| 阶段 | 游戏 | 攻略 | 角色 | 道具 |
|------|------|------|------|------|
| MVP | 100 | 500 | 1000 | 3000 |
| 长期 | 10000+ | — | — | 百万级页面 |

### 3.5 扩展方向（未来）

builds / maps / quests / achievements / walkthrough_steps / user_comments

---

## 4. 开发阶段总结

文档中存在**两套并行的阶段划分**，需注意区分：

### 4.1 project-spec.md 的大阶段（4 个）

| Phase | 主题 | 内容 |
|-------|------|------|
| Phase 1 | MVP | Next.js + Supabase + 首页 + 游戏列表/详情 + 攻略 + 后台 |
| Phase 2 | 内容系统 | 批量导入 + SEO + Sitemap（AI 内容生产已移除，改用本地 AI 工具辅助） |
| Phase 3 | 自动化 | 内容更新流程（爬虫系统已移除，改用本地 AI 工具辅助） |
| Phase 4 | 商业化 | 广告 + 联盟 + 数据分析 |

### 4.2 ai-coding-roadmap.md 的细粒度阶段（11 个）

| Phase | 主题 | 关键产出 |
|-------|------|----------|
| 0 | 项目初始化 | Next.js + Tailwind + Git |
| 1 | 数据库建设 | Supabase migration + 类型 |
| 2 | 网站基础框架 | Layout + 导航 + 路由骨架 |
| 3 | 游戏库系统 | /games + /games/[slug] |
| 4 | 攻略 Wiki 系统 | /guides/[slug] + Markdown |
| 5 | 后台 CMS | /admin + CRUD |
| 6-7 | 已移除 | AI 内容生产与爬虫系统改为使用本地 AI 工具辅助 |
| 8 | SEO 优化 | Metadata + Sitemap + Schema |
| 9 | 广告系统 | components/ads |
| 10 | 数据分析 | Google Analytics |
| 11 | 部署上线 | Vercel + Cloudflare |

### 4.3 推进原则

- 永远先分析再修改
- 小功能提交，不一次性生成整站
- 保持数据库稳定
- 不为炫技引入复杂技术
- 内容资产优先于代码

---

## 5. 设计中的潜在问题

> 以下问题在正式开发前必须澄清或修正，否则会导致返工或架构失控。

### 5.1 严重问题（影响数据模型，必须先解决）

#### 问题 A：games 表的 platform_id 与多对多关系自相矛盾

- [02-database-schema.md](docs/02-database-schema.md) §5 明确写道："不要使用 game.platform_id，改为多对多"
- 但同文档 §4 的 games 表 schema 里**仍然列出 `platform_id` 字段**
- [01-project-spec.md](docs/01-project-spec.md) §8 的 games 表也保留了 `platform_id`

**影响**：开发时无法判断主平台字段是否保留，会导致 migration 与查询逻辑混乱。

#### 问题 B：genre 字段与 genres 多对多表重复

- games 表有单值 `genre` 字段
- 同时存在 `genres` + `game_genres` 多对多设计
- 一个游戏可能同时是 RPG + ADV，单值字段无法表达

**影响**：筛选/查询逻辑无法统一。

#### 问题 C：SEO 元数据双重存储

- games / guides 表内嵌 `seo_title` / `seo_description`
- 同时存在独立的 `seo_metadata` 表（entity_type + entity_id）
- 两个数据源更新不同步会导致 SEO 数据不一致

**影响**：SEO 是本项目核心，数据源不唯一是致命风险。

#### 问题 D：guides.content 与 guide_sections 关系未定义

- guides 表有 `content`（Markdown）
- 又有 `guide_sections` 表用于大型攻略拆章节
- 文档未说明：何时用 content、何时用 sections、两者如何协同（content 是否为 sections 的聚合？）

**影响**：攻略渲染逻辑与编辑器设计无法确定。

### 5.2 中等问题（影响开发节奏与一致性）

#### 问题 E：两套 Phase 编号容易混淆

- project-spec 的 Phase 1-4（粗）与 roadmap 的 Phase 0-11（细）并行存在
- 团队沟通时"Phase 1"指代不清

#### 问题 F：URL 规范存在不一致

- 路由 `/platform/[slug]`（单数）vs 其他资源 `/games` `/guides`（复数）
- `/emulator`（单数）同样不符合复数惯例
- [01-project-spec.md](docs/01-project-spec.md) §6 目录结构里**没有 platform 路由目录**

#### 问题 G：MVP 内容目标自相矛盾

- [01-project-spec.md](docs/01-project-spec.md) §17：MVP = 100 游戏 / 500 攻略
- [06-mvp-content-list.md](docs/06-mvp-content-list.md) §8：第一阶段只做 10 个旗舰游戏
- 两个数字差距 10 倍，开发节奏与上线标准无法确定

#### 问题 H：后台权限方案过于模糊

- 文档说"单用户不需要复杂权限"
- 但未明确：Supabase Auth？环境变量密码？NextAuth？
- `/admin` 的具体保护机制（中间件？Session？）未定

### 5.3 技术风险问题

#### 问题 I：中文全文搜索方案不可行

- 阶段1 设计用 PostgreSQL FTS
- 但 PostgreSQL FTS 默认**不支持中文分词**（需 zhparser 扩展，Supabase 云端默认不带）
- 中文 FTS 实际效果差，等于没有搜索

**建议**：第一阶段改用 `ILIKE` 简单匹配 + `search_keywords` 字段，或引入 Meilisearch。

#### 问题 J：搜索方案阶段切换无抽象层

- 阶段1 FTS → 阶段2 Elasticsearch
- 切换时所有查询代码需重写，未设计 Repository 抽象层

#### 问题 K：AI 内容生产缺技术细节（已移除）

> AI 内容生产模块已从项目中移除，改为使用本地 AI 工具（如 CC、trae）辅助，本问题不再适用。

#### 问题 L：图片来源与版权未明确

- 用 Supabase Storage 存图
- 但未说明图片来源：手动上传？官方授权？
- 游戏封面/截图存在明确版权风险，文档未提及规避策略
- `media` 表无版权字段（license / source / credit）

#### 问题 M：页面渲染策略模糊

- [08-deployment-and-operation.md](docs/08-deployment-and-operation.md) 提了一句"ISR 24 小时"
- 但未明确：哪些页 SSG / SSR / ISR / CSR？
- 内容更新后如何触发重新生成（后台发布 → revalidate？）

### 5.4 流程类问题

#### 问题 N：内链系统缺技术实现

- 多份文档强调"内链是 SEO 核心"
- 但未定义：内链是手动维护还是自动生成？推荐规则表？算法？
- 缺少 `internal_links` 规则表或自动推荐设计

#### 问题 O：Migration 管理工具未定

- 要求用 `supabase/migrations/` 目录
- 未明确：用 Supabase CLI 还是手动 SQL？
- 文件命名规范未定（`001_xxx.sql` 还是时间戳？）

---

## 6. 正式开发前需确认的事项

> 以下决策项需在动手写第一行代码前明确，按优先级排序。

### 6.1 必须立即确认（P0，阻塞开发）

| # | 决策项 | 候选方案 | 建议 |
|---|--------|----------|------|
| 1 | **games.platform_id 与 genre 字段去留** | 保留 / 移除（纯走多对多） | 移除，统一多对多 |
| 2 | **SEO 元数据单一数据源** | 表内字段 / seo_metadata 表 | 统一用 seo_metadata 表，表内字段废弃 |
| 3 | **guides.content vs guide_sections** | 二选一 / content 为 sections 聚合 | content 为主，sections 可选（仅超长攻略用） |
| 4 | **MVP 实际内容目标** | 10 旗舰 / 100 游戏 | 先 10 旗舰 → 再扩 100 |
| 5 | **Phase 编号统一** | project-spec 4 阶段 / roadmap 9 阶段（Phase 6-7 已移除） | 以 roadmap 9 阶段为执行单元，归入 project-spec 4 大阶段 |

### 6.2 技术选型确认（P1，影响架构）

| # | 决策项 | 待确认 |
|---|--------|--------|
| 6 | **后台登录方案** | Supabase Auth / 环境变量密码 / NextAuth？ |
| 7 | **中文搜索方案** | ILIKE + 关键词字段 / Meilisearch / 其他？ |
| 8 | **Migration 工具** | Supabase CLI / 手动 SQL？命名规范？ |
| 9 | **页面渲染策略** | 游戏详情 ISR？列表 SSR？后台 CSR？revalidate 触发方式？ |

### 6.3 URL 与规范确认（P1）

| # | 决策项 | 建议 |
|---|--------|------|
| 11 | **/platform vs /platforms** | 统一复数 `/platforms` |
| 12 | **/emulator vs /emulators** | 统一复数 `/emulators` |
| 13 | **补全 project-spec §6 目录结构** | 增加 platform / platforms 路由目录 |

### 6.4 内容与资源确认（P2，影响上线）

| # | 决策项 | 待确认 |
|---|--------|--------|
| 14 | **图片来源与版权策略** | 手动上传 / 授权？版权规避方案？ |
| 15 | **media 表是否增加版权字段** | license / source / credit |
| 16 | **内容审核人** | 谁负责内容的人工审核？ |
| 17 | **内链实现方式** | 手动 / 半自动规则 / 自动推荐算法？ |

### 6.5 环境与账号准备（P2，影响部署）

| # | 决策项 | 待确认 |
|---|--------|--------|
| 18 | **Supabase 项目** | 是否已创建？URL 与 Key 是否就绪？ |
| 19 | **Vercel / Cloudflare / GitHub 账号** | 是否齐全？ |
| 20 | **域名** | 是否已购买？备案情况？ |
| 21 | **Git 仓库策略** | 公开 / 私有？main+develop 双分支 / 单 main？ |

---

## 7. 总体评估

### 7.1 优势

- **文档体系完整**：8 份文档覆盖产品/技术/内容/SEO/运营，方向一致
- **定位清晰**：明确不追新闻热点，做长期资产，符合个人运营能力边界
- **技术栈现代且克制**：Next.js + Supabase 免费起步，无过度工程
- **内容战略扎实**：游戏优先级、内容树模型、长尾关键词策略清晰
- **内容规范严格**：明确 draft → 审核 → published，避免垃圾内容

### 7.2 风险

- **数据模型有自相矛盾**（问题 A-D），必须在 Phase 1 前修正
- **中文搜索方案不可行**（问题 I），需替换
- **两套阶段编号**易致沟通混乱（问题 E）
- **图片的版权/成本**未规划（问题 L）

### 7.3 建议

1. **先修正 4 个严重数据模型问题**（§5.1），更新 [02-database-schema.md](docs/02-database-schema.md)
2. **统一 Phase 编号**为 roadmap 的 9 阶段（Phase 6-7 已移除）
3. **确认 §6.1 的 5 项 P0 决策**后，再启动 Phase 0 项目初始化
4. **第一阶段搜索改用 ILIKE**，避免 FTS 中文分词陷阱
5. **图片先用手动上传 + 占位图**，版权策略后续补

---

## 附录：文档索引

| 编号 | 文档 | 路径 |
|------|------|------|
| 01 | 项目规格 | [docs/01-project-spec.md](docs/01-project-spec.md) |
| 02 | 数据库设计 | [docs/02-database-schema.md](docs/02-database-schema.md) |
| 03 | 开发路线图 | [docs/03-ai-coding-roadmap.md](docs/03-ai-coding-roadmap.md) |
| 04 | 内容战略 | [docs/04-content-strategy.md](docs/04-content-strategy.md) |
| 05 | AI 开发规范 | [docs/05-ai-agent-rules.md](docs/05-ai-agent-rules.md) |
| 06 | MVP 内容清单 | [docs/06-mvp-content-list.md](docs/06-mvp-content-list.md) |
| 07 | SEO 架构 | [docs/07-seo-architecture.md](docs/07-seo-architecture.md) |
| 08 | 部署运营 | [docs/08-deployment-and-operation.md](docs/08-deployment-and-operation.md) |

END
