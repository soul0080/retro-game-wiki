-- ============================================================================
-- 005_seo_and_meta.sql
-- SEO 元数据 / 媒体 / 标签 / 新闻 / 后台设置 / AI 生成记录
-- 对应 docs/02-database-schema.md §15, §16, §17, §18, §19, §20
-- 设计修订 v1.1：seo_metadata 为唯一 SEO 数据源
-- ============================================================================

-- ----------------------------------------------------------------------------
-- seo_metadata SEO 元数据表（唯一 SEO 数据源）
-- ----------------------------------------------------------------------------
create table if not exists seo_metadata (
  id            uuid primary key default gen_random_uuid(),
  entity_type   text not null
                check (entity_type in ('game', 'guide', 'platform', 'topic', 'news', 'emulator_guide')),
  entity_id     uuid not null,
  title         text,
  description   text,
  keywords      text[],
  canonical_url text,
  og_image_url  text,
  noindex       boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (entity_type, entity_id)
);

comment on table seo_metadata is '统一 SEO 元数据（唯一数据源，替代各表内嵌 seo 字段）';
comment on column seo_metadata.entity_type is 'game/guide/platform/topic/news/emulator_guide';
comment on column seo_metadata.keywords is '关键词数组';
comment on column seo_metadata.noindex is '是否禁止索引，默认 false';

create index if not exists idx_seo_metadata_entity on seo_metadata(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- media 图片资源表
-- ----------------------------------------------------------------------------
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null
              check (entity_type in ('game', 'character', 'item', 'boss', 'guide', 'emulator_guide')),
  entity_id   uuid not null,
  url         text not null,
  alt_text    text,
  type        text,
  created_at  timestamptz not null default now()
);

comment on table media is '统一图片资源管理';
comment on column media.entity_type is 'game/character/item/boss/guide/emulator_guide';

create index if not exists idx_media_entity on media(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- tags 标签表（用于专题）
-- ----------------------------------------------------------------------------
create table if not exists tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

comment on table tags is '标签（用于专题聚合）';

create index if not exists idx_tags_slug on tags(slug);

-- ----------------------------------------------------------------------------
-- game_tags 游戏与标签多对多
-- ----------------------------------------------------------------------------
create table if not exists game_tags (
  id        uuid primary key default gen_random_uuid(),
  game_id   uuid not null references games(id) on delete cascade,
  tag_id    uuid not null references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (game_id, tag_id)
);

create index if not exists idx_game_tags_game on game_tags(game_id);
create index if not exists idx_game_tags_tag on game_tags(tag_id);

-- ----------------------------------------------------------------------------
-- news 新闻表（独立于 Wiki）
-- ----------------------------------------------------------------------------
create table if not exists news (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  source          text,
  source_url      text,
  summary         text,
  content         text,
  cover_url       text,
  related_game_id uuid references games(id) on delete set null,
  status          text not null default 'draft'
                  check (status in ('draft', 'review', 'published', 'archived')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table news is '新闻（独立于 Wiki，不进入知识库）';

create index if not exists idx_news_slug on news(slug);
create index if not exists idx_news_status on news(status);
create index if not exists idx_news_published_at on news(published_at desc);

-- ----------------------------------------------------------------------------
-- admin_settings 后台设置表
-- ----------------------------------------------------------------------------
create table if not exists admin_settings (
  id    uuid primary key default gen_random_uuid(),
  key   text not null unique,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table admin_settings is '后台设置（站名/广告代码/统计代码等）';

-- ----------------------------------------------------------------------------
-- ai_generations AI 生成记录表
-- ----------------------------------------------------------------------------
create table if not exists ai_generations (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id   uuid,
  prompt      text not null,
  model       text,
  output      text,
  tokens_used int,
  status      text not null default 'pending'
              check (status in ('pending', 'success', 'failed')),
  error       text,
  created_at  timestamptz not null default now()
);

comment on table ai_generations is 'AI 生成历史记录（便于追溯与重新生成）';
comment on column ai_generations.tokens_used is 'token 消耗量，用于成本监控';

create index if not exists idx_ai_generations_entity on ai_generations(entity_type, entity_id);
create index if not exists idx_ai_generations_status on ai_generations(status);
create index if not exists idx_ai_generations_created on ai_generations(created_at desc);

-- ----------------------------------------------------------------------------
-- 触发器：自动更新 updated_at
-- ----------------------------------------------------------------------------
create trigger trg_seo_metadata_updated_at
  before update on seo_metadata
  for each row execute function update_updated_at();

create trigger trg_news_updated_at
  before update on news
  for each row execute function update_updated_at();

create trigger trg_admin_settings_updated_at
  before update on admin_settings
  for each row execute function update_updated_at();
