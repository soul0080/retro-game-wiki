-- ============================================================================
-- 004_game_entities.sql
-- 游戏实体资料：角色 / Boss / 道具 / 秘籍 / 模拟器教程
-- 对应 docs/02-database-schema.md §10, §11, §12, §13, §14
-- ============================================================================

-- ----------------------------------------------------------------------------
-- characters 角色表
-- ----------------------------------------------------------------------------
create table if not exists characters (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references games(id) on delete cascade,
  name        text not null,
  nickname    text,
  description text,
  join_method text,
  skills      jsonb,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table characters is '游戏角色资料';
comment on column characters.skills is '技能列表，JSON 数组';

create index if not exists idx_characters_game on characters(game_id);
create index if not exists idx_characters_name on characters(name);

-- ----------------------------------------------------------------------------
-- bosses Boss 表
-- ----------------------------------------------------------------------------
create table if not exists bosses (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references games(id) on delete cascade,
  name        text not null,
  description text,
  hp          int,
  weakness    text,
  strategy    text,
  drops       jsonb,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table bosses is 'Boss 资料与打法';
comment on column bosses.drops is '掉落物品，JSON 数组';

create index if not exists idx_bosses_game on bosses(game_id);
create index if not exists idx_bosses_name on bosses(name);

-- ----------------------------------------------------------------------------
-- items 道具表
-- ----------------------------------------------------------------------------
create table if not exists items (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references games(id) on delete cascade,
  name        text not null,
  type        text not null default 'item'
              check (type in ('weapon', 'armor', 'magic', 'item', 'accessory')),
  description text,
  effect      text,
  location    text,
  rarity      text,
  image_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table items is '道具资料（武器/防具/魔法/道具/饰品）';

create index if not exists idx_items_game on items(game_id);
create index if not exists idx_items_type on items(type);
create index if not exists idx_items_name on items(name);

-- ----------------------------------------------------------------------------
-- cheats 秘籍表
-- ----------------------------------------------------------------------------
create table if not exists cheats (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references games(id) on delete cascade,
  platform_id uuid references platforms(id) on delete restrict,
  title       text not null,
  code        text,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table cheats is '游戏秘籍与金手指';

create index if not exists idx_cheats_game on cheats(game_id);
create index if not exists idx_cheats_platform on cheats(platform_id);

-- ----------------------------------------------------------------------------
-- emulator_guides 模拟器教程表
-- ----------------------------------------------------------------------------
create table if not exists emulator_guides (
  id                  uuid primary key default gen_random_uuid(),
  platform_id         uuid not null references platforms(id) on delete cascade,
  title               text not null,
  slug                text not null unique,
  software            text,
  content             text,
  recommended_setting jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table emulator_guides is '模拟器安装与设置教程';
comment on column emulator_guides.recommended_setting is '推荐设置，JSON 对象';

create index if not exists idx_emulator_guides_slug on emulator_guides(slug);
create index if not exists idx_emulator_guides_platform on emulator_guides(platform_id);

-- ----------------------------------------------------------------------------
-- 触发器：自动更新 updated_at
-- ----------------------------------------------------------------------------
create trigger trg_characters_updated_at
  before update on characters
  for each row execute function update_updated_at();

create trigger trg_bosses_updated_at
  before update on bosses
  for each row execute function update_updated_at();

create trigger trg_items_updated_at
  before update on items
  for each row execute function update_updated_at();

create trigger trg_cheats_updated_at
  before update on cheats
  for each row execute function update_updated_at();

create trigger trg_emulator_guides_updated_at
  before update on emulator_guides
  for each row execute function update_updated_at();
