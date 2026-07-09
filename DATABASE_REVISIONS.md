# 数据库设计修订记录

> 本文档记录数据库设计与项目文档的所有修订，便于追溯变更原因与影响范围。

---

## v1.1 — 2026-07-09（Phase 1 前修正）

### 背景

基于 [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) §5 识别的 5 个 P0 问题，在启动 Phase 1 数据库建设前统一修正，避免 migration 返工。

---

### 修订 1：games 表移除 platform_id 与 genre 字段

**问题**：[02-database-schema.md](docs/02-database-schema.md) §5 明确"不要使用 game.platform_id，改为多对多"，但 §4 的 games 表 schema 仍保留 `platform_id`；同时 games 表有单值 `genre` 字段，与 `genres` + `game_genres` 多对多设计重复。

**修正**：
- 从 games 表移除 `platform_id`、`genre` 字段
- 平台关系统一走 `game_platforms` 多对多表
- 类型关系统一走 `game_genres` 多对多表

**影响文件**：
- [docs/02-database-schema.md](docs/02-database-schema.md) §4
- [docs/01-project-spec.md](docs/01-project-spec.md) §8

---

### 修订 2：SEO 元数据统一到 seo_metadata 表

**问题**：games / guides 表内嵌 `seo_title` / `seo_description`，同时存在独立 `seo_metadata` 表，两个数据源易不同步。SEO 是本项目核心，数据源不唯一是致命风险。

**修正**：
- 从 games 表移除 `seo_title` / `seo_description`
- 从 guides 表移除 `seo_title` / `seo_description`
- 所有实体的 SEO 数据统一通过 `seo_metadata` 表管理（entity_type + entity_id）
- seo_metadata 表新增字段：`og_image_url`、`noindex`、`created_at`、`updated_at`
- 明确 (entity_type, entity_id) 唯一索引

**影响文件**：
- [docs/02-database-schema.md](docs/02-database-schema.md) §4、§8、§18
- [docs/01-project-spec.md](docs/01-project-spec.md) §8

---

### 修订 3：明确 guides.content 与 guide_sections 的关系

**问题**：guides 表有 `content` 字段，又有 `guide_sections` 表用于拆章节，文档未说明两者如何协同，导致渲染与编辑逻辑无法确定。

**修正**：
- 明确 `guides.content` 是**主存储**，所有攻略必须有 content
- `guide_sections` 是**可选**，仅用于超长攻略（≥ 5000 字或多章节）的分章视图
- 渲染规则：有 sections 时优先拼接 sections，无 sections 时回退到 content
- 编辑规则：guide_sections 编辑后需同步回写 guides.content

**影响文件**：
- [docs/02-database-schema.md](docs/02-database-schema.md) §8

---

### 修订 4：MVP 内容目标分两步达成

**问题**：[01-project-spec.md](docs/01-project-spec.md) §17 要求 MVP = 100 游戏 / 500 攻略，但 [06-mvp-content-list.md](docs/06-mvp-content-list.md) §8 第一阶段只做 10 个旗舰，两个数字差距 10 倍，上线标准无法确定。

**修正**：
- MVP 分两步达成
  - **第一步：旗舰上线**（首个可发布版本）= 10 旗舰游戏 + 每游戏 ≥5 篇攻略 + 5 核心平台 + 完整 SEO + 后台 CMS
  - **第二步：MVP 完整版**（Phase 1 大阶段目标）= 100 游戏 + 500 攻略 + 10 平台 + 广告接口
- mvp-content-list §8 的阶段1 明确为"第一步上线标准"

**影响文件**：
- [docs/01-project-spec.md](docs/01-project-spec.md) §17
- [docs/06-mvp-content-list.md](docs/06-mvp-content-list.md) §8

---

### 修订 5：统一 Phase 编号

**问题**：[01-project-spec.md](docs/01-project-spec.md) 的 Phase 1-4（粗）与 [03-ai-coding-roadmap.md](docs/03-ai-coding-roadmap.md) 的 Phase 0-11（细）并行存在，"Phase 1"指代不清。

**修正**：
- 以 [03-ai-coding-roadmap.md](docs/03-ai-coding-roadmap.md) 的 11 个细粒度阶段为**执行单元**
- [01-project-spec.md](docs/01-project-spec.md) 的 4 个大阶段作为**里程碑分组**，并标注对应 roadmap 阶段：
  - Phase 1 MVP = roadmap Phase 0-5 + 8 + 11
  - Phase 2 内容系统 = roadmap Phase 6
  - Phase 3 自动化 = roadmap Phase 7
  - Phase 4 商业化 = roadmap Phase 9-10

**影响文件**：
- [docs/01-project-spec.md](docs/01-project-spec.md) §15

---

## 修订后的 games 表最终结构（v1.1）

```sql
games
  id              UUID PK
  name_cn         text
  name_en         text
  name_jp         text
  slug            text unique
  release_year    int
  developer       text
  publisher       text
  region          text
  description     text
  story_summary   text
  cover_url       text
  banner_url      text
  status          text  -- draft/review/published/archived
  created_at      timestamptz
  updated_at      timestamptz
```

> 平台关系 → game_platforms
> 类型关系 → game_genres
> SEO 数据 → seo_metadata (entity_type='game')

---

## 修订后的 guides 表最终结构（v1.1）

```sql
guides
  id              UUID PK
  game_id         UUID FK -> games.id
  title           text
  slug            text unique
  guide_type      text  -- main_story/boss/sidequest/item/secret/character/ending
  summary         text
  content         text  -- Markdown，主存储
  difficulty      text
  is_featured     boolean
  status          text  -- draft/review/published/archived
  created_at      timestamptz
  updated_at      timestamptz
```

> SEO 数据 → seo_metadata (entity_type='guide')
> 章节拆分 → guide_sections（可选，仅超长攻略）

END
