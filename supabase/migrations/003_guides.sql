-- ============================================================================
-- 003_guides.sql
-- 攻略表 + 攻略章节表
-- 对应 docs/02-database-schema.md §8, §9
-- 设计修订 v1.1：移除 seo 字段；明确 content vs guide_sections 关系
-- ============================================================================

-- ----------------------------------------------------------------------------
-- guides 攻略表
-- ----------------------------------------------------------------------------
create table if not exists guides (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid not null references games(id) on delete cascade,
  title        text not null,
  slug         text not null unique,
  guide_type   text not null default 'main_story'
               check (guide_type in ('main_story', 'boss', 'sidequest', 'item', 'secret', 'character', 'ending')),
  summary      text,
  content      text,
  difficulty   text,
  is_featured  boolean not null default false,
  status       text not null default 'draft'
               check (status in ('draft', 'review', 'published', 'archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table guides is '攻略表，核心 SEO 内容';
comment on column guides.content is 'Markdown 正文，主存储（guide_sections 为可选分章视图）';
comment on column guides.guide_type is 'main_story/boss/sidequest/item/secret/character/ending';

create index if not exists idx_guides_slug on guides(slug);
create index if not exists idx_guides_game on guides(game_id);
create index if not exists idx_guides_status on guides(status);
create index if not exists idx_guides_type on guides(guide_type);
create index if not exists idx_guides_featured on guides(is_featured) where is_featured = true;

-- ----------------------------------------------------------------------------
-- guide_sections 攻略章节表（可选，仅超长攻略用）
-- ----------------------------------------------------------------------------
create table if not exists guide_sections (
  id           uuid primary key default gen_random_uuid(),
  guide_id     uuid not null references guides(id) on delete cascade,
  title        text not null,
  order_number int not null default 0,
  content      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table guide_sections is '攻略章节（可选，仅超长攻略分章用，是 guides.content 的分章视图）';

create index if not exists idx_guide_sections_guide on guide_sections(guide_id);
create index if not exists idx_guide_sections_order on guide_sections(guide_id, order_number);

-- ----------------------------------------------------------------------------
-- 触发器：自动更新 updated_at
-- ----------------------------------------------------------------------------
create trigger trg_guides_updated_at
  before update on guides
  for each row execute function update_updated_at();

create trigger trg_guide_sections_updated_at
  before update on guide_sections
  for each row execute function update_updated_at();
