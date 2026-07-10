/**
 * Retro Game Wiki - 数据库类型定义
 *
 * 对应 supabase/migrations/ 下的 schema（设计修订 v1.1）
 * 文档：docs/02-database-schema.md
 *
 * 当数据库 schema 变更时，需同步更新此文件。
 */

// ============================================================================
// 公共类型
// ============================================================================

/** 内容状态枚举 */
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

/** 攻略类型枚举 */
export type GuideType =
  | 'main_story'
  | 'boss'
  | 'sidequest'
  | 'item'
  | 'secret'
  | 'character'
  | 'ending';

/** 道具类型枚举 */
export type ItemType = 'weapon' | 'armor' | 'magic' | 'item' | 'accessory';

/** SEO 实体类型枚举 */
export type SeoEntityType =
  | 'game'
  | 'guide'
  | 'platform'
  | 'topic'
  | 'news'
  | 'emulator_guide';

/** 媒体实体类型枚举 */
export type MediaEntityType =
  | 'game'
  | 'character'
  | 'item'
  | 'boss'
  | 'guide'
  | 'emulator_guide';

// ============================================================================
// 表结构类型
// ============================================================================

/** 平台表 platforms */
export interface Platform {
  id: string;
  name: string;
  slug: string;
  manufacturer: string | null;
  release_year: number | null;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

/** 游戏类型表 genres */
export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** 游戏主表 games（设计修订 v1.1：无 platform_id/genre/seo 字段） */
export interface Game {
  id: string;
  name_cn: string;
  name_en: string | null;
  name_jp: string | null;
  slug: string;
  release_year: number | null;
  developer: string | null;
  publisher: string | null;
  region: string | null;
  description: string | null;
  story_summary: string | null;
  cover_url: string | null;
  banner_url: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

/** 游戏与平台关系 game_platforms */
export interface GamePlatform {
  id: string;
  game_id: string;
  platform_id: string;
  release_date: string | null;
  region: string | null;
  version_note: string | null;
  created_at: string;
}

/** 游戏与类型关系 game_genres */
export interface GameGenre {
  id: string;
  game_id: string;
  genre_id: string;
  created_at: string;
}

/** 攻略表 guides（设计修订 v1.1：无 seo 字段） */
export interface Guide {
  id: string;
  game_id: string;
  title: string;
  slug: string;
  guide_type: GuideType;
  summary: string | null;
  content: string | null;
  difficulty: string | null;
  is_featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

/** 攻略章节表 guide_sections（可选，仅超长攻略用） */
export interface GuideSection {
  id: string;
  guide_id: string;
  title: string;
  order_number: number;
  content: string | null;
  created_at: string;
  updated_at: string;
}

/** 角色表 characters */
export interface Character {
  id: string;
  game_id: string;
  name: string;
  nickname: string | null;
  description: string | null;
  join_method: string | null;
  skills: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Boss 表 bosses */
export interface Boss {
  id: string;
  game_id: string;
  name: string;
  description: string | null;
  hp: number | null;
  weakness: string | null;
  strategy: string | null;
  drops: string[] | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** 道具表 items */
export interface Item {
  id: string;
  game_id: string;
  name: string;
  type: ItemType;
  description: string | null;
  effect: string | null;
  location: string | null;
  rarity: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/** 秘籍表 cheats */
export interface Cheat {
  id: string;
  game_id: string;
  platform_id: string | null;
  title: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/** 模拟器教程表 emulator_guides */
export interface EmulatorGuide {
  id: string;
  platform_id: string;
  title: string;
  slug: string;
  software: string | null;
  content: string | null;
  recommended_setting: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** SEO 元数据表 seo_metadata（设计修订 v1.1：唯一 SEO 数据源） */
export interface SeoMetadata {
  id: string;
  entity_type: SeoEntityType;
  entity_id: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  canonical_url: string | null;
  og_image_url: string | null;
  noindex: boolean;
  created_at: string;
  updated_at: string;
}

/** 媒体资源表 media */
export interface Media {
  id: string;
  entity_type: MediaEntityType;
  entity_id: string;
  url: string;
  alt_text: string | null;
  type: string | null;
  created_at: string;
}

/** 标签表 tags */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/** 游戏与标签关系 game_tags */
export interface GameTag {
  id: string;
  game_id: string;
  tag_id: string;
  created_at: string;
}

/** 新闻表 news */
export interface News {
  id: string;
  title: string;
  slug: string;
  source: string | null;
  source_url: string | null;
  summary: string | null;
  content: string | null;
  cover_url: string | null;
  related_game_id: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** 后台设置表 admin_settings */
export interface AdminSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 复合类型（用于查询结果的关联数据）
// ============================================================================

/** 游戏详情（含平台、类型、标签） */
export interface GameWithRelations extends Game {
  platforms?: Platform[];
  genres?: Genre[];
  tags?: Tag[];
  seo?: SeoMetadata | null;
}

/** 攻略详情（含游戏、章节） */
export interface GuideWithRelations extends Guide {
  game?: Pick<Game, 'id' | 'name_cn' | 'slug'> | null;
  sections?: GuideSection[];
  seo?: SeoMetadata | null;
}

// ============================================================================
// 数据库 Schema 映射（供 Supabase 客户端类型推断用）
// ============================================================================

export interface Database {
  public: {
    Tables: {
      platforms: {
        Row: Platform;
        Insert: Omit<Platform, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Platform, 'id' | 'created_at' | 'updated_at'>>;
      };
      genres: {
        Row: Genre;
        Insert: Omit<Genre, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Genre, 'id' | 'created_at' | 'updated_at'>>;
      };
      games: {
        Row: Game;
        Insert: Omit<Game, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Game, 'id' | 'created_at' | 'updated_at'>>;
      };
      game_platforms: {
        Row: GamePlatform;
        Insert: Omit<GamePlatform, 'id' | 'created_at'>;
        Update: Partial<Omit<GamePlatform, 'id' | 'created_at'>>;
      };
      game_genres: {
        Row: GameGenre;
        Insert: Omit<GameGenre, 'id' | 'created_at'>;
        Update: Partial<Omit<GameGenre, 'id' | 'created_at'>>;
      };
      guides: {
        Row: Guide;
        Insert: Omit<Guide, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Guide, 'id' | 'created_at' | 'updated_at'>>;
      };
      guide_sections: {
        Row: GuideSection;
        Insert: Omit<GuideSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GuideSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      characters: {
        Row: Character;
        Insert: Omit<Character, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Character, 'id' | 'created_at' | 'updated_at'>>;
      };
      bosses: {
        Row: Boss;
        Insert: Omit<Boss, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Boss, 'id' | 'created_at' | 'updated_at'>>;
      };
      items: {
        Row: Item;
        Insert: Omit<Item, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Item, 'id' | 'created_at' | 'updated_at'>>;
      };
      cheats: {
        Row: Cheat;
        Insert: Omit<Cheat, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Cheat, 'id' | 'created_at' | 'updated_at'>>;
      };
      emulator_guides: {
        Row: EmulatorGuide;
        Insert: Omit<EmulatorGuide, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EmulatorGuide, 'id' | 'created_at' | 'updated_at'>>;
      };
      seo_metadata: {
        Row: SeoMetadata;
        Insert: Omit<SeoMetadata, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SeoMetadata, 'id' | 'created_at' | 'updated_at'>>;
      };
      media: {
        Row: Media;
        Insert: Omit<Media, 'id' | 'created_at'>;
        Update: Partial<Omit<Media, 'id' | 'created_at'>>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, 'id' | 'created_at'>;
        Update: Partial<Omit<Tag, 'id' | 'created_at'>>;
      };
      game_tags: {
        Row: GameTag;
        Insert: Omit<GameTag, 'id' | 'created_at'>;
        Update: Partial<Omit<GameTag, 'id' | 'created_at'>>;
      };
      news: {
        Row: News;
        Insert: Omit<News, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<News, 'id' | 'created_at' | 'updated_at'>>;
      };
      admin_settings: {
        Row: AdminSetting;
        Insert: Omit<AdminSetting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdminSetting, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
