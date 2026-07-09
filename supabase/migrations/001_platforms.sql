-- ============================================================================
-- 001_platforms.sql
-- 平台表 + 游戏类型表 + 初始数据
-- 对应 docs/02-database-schema.md §3, §6
-- ============================================================================

-- 启用 UUID 扩展
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- platforms 平台表
-- ----------------------------------------------------------------------------
create table if not exists platforms (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  manufacturer text,
  release_year int,
  description  text,
  logo_url     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table platforms is '游戏平台（FC/SFC/GBA/PS1 等）';

create index if not exists idx_platforms_slug on platforms(slug);

-- ----------------------------------------------------------------------------
-- genres 游戏类型表
-- ----------------------------------------------------------------------------
create table if not exists genres (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table genres is '游戏类型（RPG/ACT/SLG/ADV 等）';

create index if not exists idx_genres_slug on genres(slug);

-- ----------------------------------------------------------------------------
-- 初始数据：核心平台（对应 06-mvp-content-list.md §4）
-- ----------------------------------------------------------------------------
insert into platforms (name, slug, manufacturer, release_year, description) values
  ('FC 红白机',     'fc',   'Nintendo', 1983, 'Family Computer，任天堂 8 位主机'),
  ('SFC 超级任天堂', 'sfc',  'Nintendo', 1990, 'Super Famicom，16 位主机黄金时代'),
  ('GBA',           'gba',  'Nintendo', 2001, 'Game Boy Advance，32 位掌机'),
  ('PS1',           'ps1',  'Sony',     1994, 'PlayStation，索尼初代主机'),
  ('PSP',           'psp',  'Sony',     2004, 'PlayStation Portable，索尼掌机'),
  ('NDS',           'nds',  'Nintendo', 2004, 'Nintendo DS，双屏掌机'),
  ('N64',           'n64',  'Nintendo', 1996, 'Nintendo 64，64 位主机'),
  ('SS',            'ss',   'Sega',     1994, 'Sega Saturn，世嘉土星'),
  ('DC',            'dc',   'Sega',     1998, 'Dreamcast，世嘉末代主机'),
  ('MD',            'md',   'Sega',     1988, 'Mega Drive，世嘉 16 位主机')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 初始数据：游戏类型
-- ----------------------------------------------------------------------------
insert into genres (name, slug, description) values
  ('RPG',   'rpg',  '角色扮演游戏'),
  ('ARPG',  'arpg', '动作角色扮演'),
  ('SRPG',  'srpg', '策略角色扮演'),
  ('ACT',   'act',  '动作游戏'),
  ('ADV',   'adv',  '冒险游戏'),
  ('SLG',   'slg',  '策略游戏'),
  ('STG',   'stg',  '射击游戏'),
  ('FTG',   'ftg',  '格斗游戏'),
  ('RAC',   'rac',  '竞速游戏'),
  ('PUZ',   'puz',  '益智游戏'),
  ('MST',   'mst',  '恐怖游戏'),
  ('SPG',   'spg',  '体育游戏')
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 触发器：自动更新 updated_at
-- ----------------------------------------------------------------------------
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_platforms_updated_at
  before update on platforms
  for each row execute function update_updated_at();

create trigger trg_genres_updated_at
  before update on genres
  for each row execute function update_updated_at();
