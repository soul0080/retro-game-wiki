-- ============================================================================
-- 002_games.sql
-- 游戏主表 + 平台关系 + 类型关系
-- 对应 docs/02-database-schema.md §4, §5, §7
-- 设计修订 v1.1：移除 platform_id/genre/seo 字段
-- ============================================================================

-- ----------------------------------------------------------------------------
-- games 游戏主表
-- ----------------------------------------------------------------------------
create table if not exists games (
  id            uuid primary key default gen_random_uuid(),
  name_cn       text not null,
  name_en       text,
  name_jp       text,
  slug          text not null unique,
  release_year  int,
  developer     text,
  publisher     text,
  region        text,
  description   text,
  story_summary text,
  cover_url     text,
  banner_url    text,
  status        text not null default 'draft'
                check (status in ('draft', 'review', 'published', 'archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table games is '游戏主表，核心实体';
comment on column games.slug is 'URL 友好标识，全局唯一';
comment on column games.status is '内容状态：draft/review/published/archived';

create index if not exists idx_games_slug on games(slug);
create index if not exists idx_games_status on games(status);
create index if not exists idx_games_release_year on games(release_year);
create index if not exists idx_games_name_cn on games(name_cn);

-- ----------------------------------------------------------------------------
-- game_platforms 游戏与平台多对多关系
-- ----------------------------------------------------------------------------
create table if not exists game_platforms (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid not null references games(id) on delete cascade,
  platform_id  uuid not null references platforms(id) on delete restrict,
  release_date date,
  region       text,
  version_note text,
  created_at   timestamptz not null default now(),
  unique (game_id, platform_id)
);

comment on table game_platforms is '游戏与平台多对多（一个游戏可跨 SFC/PS1/GBA 等）';

create index if not exists idx_game_platforms_game on game_platforms(game_id);
create index if not exists idx_game_platforms_platform on game_platforms(platform_id);

-- ----------------------------------------------------------------------------
-- game_genres 游戏与类型多对多关系
-- ----------------------------------------------------------------------------
create table if not exists game_genres (
  id        uuid primary key default gen_random_uuid(),
  game_id   uuid not null references games(id) on delete cascade,
  genre_id  uuid not null references genres(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (game_id, genre_id)
);

comment on table game_genres is '游戏与类型多对多（一个游戏可同时是 RPG + ADV）';

create index if not exists idx_game_genres_game on game_genres(game_id);
create index if not exists idx_game_genres_genre on game_genres(genre_id);

-- ----------------------------------------------------------------------------
-- 触发器：自动更新 updated_at
-- ----------------------------------------------------------------------------
create trigger trg_games_updated_at
  before update on games
  for each row execute function update_updated_at();
