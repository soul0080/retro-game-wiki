/**
 * Admin 数据层
 * 使用 service_role key，可读写所有数据（含草稿）
 * 对应 docs/02-database-schema.md
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Game, Guide, Platform, Genre, Character, Boss, Item, Cheat } from '@/types/database';

// ============ 读取（含草稿） ============

/** 获取所有游戏（含草稿，管理用） */
export async function adminGetGames(options?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<ApiResult<{ items: Game[]; total: number }>> {
  const { page = 1, pageSize = 30, status } = options || {};
  const supabase = createServerClient();
  let query = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query;
  if (error) return fail(error.message);
  return ok({ items: data || [], total: count || 0 });
}

/** 按 id 获取游戏 */
export async function adminGetGameById(id: string): Promise<ApiResult<Game>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('games').select('*').eq('id', id).single();
  if (error || !data) return fail('游戏不存在');
  return ok(data);
}

/** 获取所有攻略（含草稿） */
export async function adminGetGuides(options?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<ApiResult<{ items: Guide[]; total: number }>> {
  const { page = 1, pageSize = 30, status } = options || {};
  const supabase = createServerClient();
  let query = supabase
    .from('guides')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (status) query = query.eq('status', status);
  const { data, error, count } = await query;
  if (error) return fail(error.message);
  return ok({ items: data || [], total: count || 0 });
}

/** 按 id 获取攻略 */
export async function adminGetGuideById(id: string): Promise<ApiResult<Guide>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('guides').select('*').eq('id', id).single();
  if (error || !data) return fail('攻略不存在');
  return ok(data);
}

// ============ 写入 ============

type GameInsert = Omit<Game, 'id' | 'created_at' | 'updated_at'>;
type GameUpdate = Partial<GameInsert>;

/** 新增游戏 */
export async function adminCreateGame(data: GameInsert): Promise<ApiResult<Game>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('games')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新游戏 */
export async function adminUpdateGame(id: string, data: GameUpdate): Promise<ApiResult<Game>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('games')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 设置游戏平台关联 */
export async function adminSetGamePlatforms(
  gameId: string,
  platformIds: string[]
): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  await supabase.from('game_platforms').delete().eq('game_id', gameId);
  if (platformIds.length > 0) {
    const rows = platformIds.map((platform_id) => ({ game_id: gameId, platform_id }));
    const { error } = await supabase.from('game_platforms').insert(rows as never);
    if (error) return fail(error.message);
  }
  return ok(undefined);
}

/** 设置游戏类型关联 */
export async function adminSetGameGenres(
  gameId: string,
  genreIds: string[]
): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  await supabase.from('game_genres').delete().eq('game_id', gameId);
  if (genreIds.length > 0) {
    const rows = genreIds.map((genre_id) => ({ game_id: gameId, genre_id }));
    const { error } = await supabase.from('game_genres').insert(rows as never);
    if (error) return fail(error.message);
  }
  return ok(undefined);
}

type GuideInsert = Omit<Guide, 'id' | 'created_at' | 'updated_at'>;
type GuideUpdate = Partial<GuideInsert>;

/** 新增攻略 */
export async function adminCreateGuide(data: GuideInsert): Promise<ApiResult<Guide>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('guides')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新攻略 */
export async function adminUpdateGuide(id: string, data: GuideUpdate): Promise<ApiResult<Guide>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('guides')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 获取游戏的平台 id 列表（编辑用） */
export async function adminGetGamePlatformIds(gameId: string): Promise<ApiResult<string[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('game_platforms')
    .select('platform_id')
    .eq('game_id', gameId);
  if (error) return fail(error.message);
  return ok(((data || []) as { platform_id: string }[]).map((r) => r.platform_id));
}

/** 获取游戏的类型 id 列表（编辑用） */
export async function adminGetGameGenreIds(gameId: string): Promise<ApiResult<string[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('game_genres')
    .select('genre_id')
    .eq('game_id', gameId);
  if (error) return fail(error.message);
  return ok(((data || []) as { genre_id: string }[]).map((r) => r.genre_id));
}

/** 统计概览（仪表盘用） */
export async function adminGetStats(): Promise<
  ApiResult<{ games: number; guides: number; publishedGames: number; publishedGuides: number; platforms: number }>
> {
  const supabase = createServerClient();
  const [g, gd, pl] = await Promise.all([
    supabase.from('games').select('*', { count: 'exact', head: true }),
    supabase.from('guides').select('*', { count: 'exact', head: true }),
    supabase.from('platforms').select('*', { count: 'exact', head: true }),
  ]);
  const pg = await supabase.from('games').select('*', { count: 'exact', head: true }).eq('status', 'published');
  const pgd = await supabase.from('guides').select('*', { count: 'exact', head: true }).eq('status', 'published');
  return ok({
    games: g.count || 0,
    guides: gd.count || 0,
    publishedGames: pg.count || 0,
    publishedGuides: pgd.count || 0,
    platforms: pl.count || 0,
  });
}

// ============ 删除 ============

/** 删除游戏（含关联表） */
export async function adminDeleteGame(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  // 先删关联（保险起见，表可能已有 ON DELETE CASCADE）
  await supabase.from('game_platforms').delete().eq('game_id', id);
  await supabase.from('game_genres').delete().eq('game_id', id);
  const { error } = await supabase.from('games').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

/** 删除攻略 */
export async function adminDeleteGuide(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  const { error } = await supabase.from('guides').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

// 重导出平台/类型查询供 admin 表单使用
export { getPlatforms, getGenres } from '@/lib/queries/platforms';
export type { Platform, Genre };

// ============ 角色管理 ============

type CharacterInsert = Omit<Character, 'id' | 'created_at' | 'updated_at'>;
type CharacterUpdate = Partial<CharacterInsert>;

/** 获取角色列表（可按 game_id 筛选），按 updated_at desc 排序 */
export async function adminGetCharacters(
  gameId?: string
): Promise<ApiResult<Character[]>> {
  const supabase = createServerClient();
  let query = supabase
    .from('characters')
    .select('*')
    .order('updated_at', { ascending: false });
  if (gameId) query = query.eq('game_id', gameId);
  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 按 id 获取角色 */
export async function adminGetCharacterById(id: string): Promise<ApiResult<Character>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('characters').select('*').eq('id', id).single();
  if (error || !data) return fail('角色不存在');
  return ok(data);
}

/** 新增角色 */
export async function adminCreateCharacter(data: CharacterInsert): Promise<ApiResult<Character>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('characters')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新角色 */
export async function adminUpdateCharacter(id: string, data: CharacterUpdate): Promise<ApiResult<Character>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('characters')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 删除角色 */
export async function adminDeleteCharacter(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

// ============ Boss 管理 ============

type BossInsert = Omit<Boss, 'id' | 'created_at' | 'updated_at'>;
type BossUpdate = Partial<BossInsert>;

/** 获取 Boss 列表（可按 game_id 筛选），按 updated_at desc 排序 */
export async function adminGetBosses(
  gameId?: string
): Promise<ApiResult<Boss[]>> {
  const supabase = createServerClient();
  let query = supabase
    .from('bosses')
    .select('*')
    .order('updated_at', { ascending: false });
  if (gameId) query = query.eq('game_id', gameId);
  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 按 id 获取 Boss */
export async function adminGetBossById(id: string): Promise<ApiResult<Boss>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('bosses').select('*').eq('id', id).single();
  if (error || !data) return fail('Boss 不存在');
  return ok(data);
}

/** 新增 Boss */
export async function adminCreateBoss(data: BossInsert): Promise<ApiResult<Boss>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('bosses')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新 Boss */
export async function adminUpdateBoss(id: string, data: BossUpdate): Promise<ApiResult<Boss>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('bosses')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 删除 Boss */
export async function adminDeleteBoss(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  const { error } = await supabase.from('bosses').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

// ============ 道具管理 ============

type ItemInsert = Omit<Item, 'id' | 'created_at' | 'updated_at'>;
type ItemUpdate = Partial<ItemInsert>;

/** 获取道具列表（可按 game_id 筛选），按 updated_at desc 排序 */
export async function adminGetItems(
  gameId?: string
): Promise<ApiResult<Item[]>> {
  const supabase = createServerClient();
  let query = supabase
    .from('items')
    .select('*')
    .order('updated_at', { ascending: false });
  if (gameId) query = query.eq('game_id', gameId);
  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 按 id 获取道具 */
export async function adminGetItemById(id: string): Promise<ApiResult<Item>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
  if (error || !data) return fail('道具不存在');
  return ok(data);
}

/** 新增道具 */
export async function adminCreateItem(data: ItemInsert): Promise<ApiResult<Item>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('items')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新道具 */
export async function adminUpdateItem(id: string, data: ItemUpdate): Promise<ApiResult<Item>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('items')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 删除道具 */
export async function adminDeleteItem(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}

// ============ 秘籍管理 ============

type CheatInsert = Omit<Cheat, 'id' | 'created_at' | 'updated_at'>;
type CheatUpdate = Partial<CheatInsert>;

/** 获取秘籍列表（可按 game_id 筛选），按 updated_at desc 排序 */
export async function adminGetCheats(
  gameId?: string
): Promise<ApiResult<Cheat[]>> {
  const supabase = createServerClient();
  let query = supabase
    .from('cheats')
    .select('*')
    .order('updated_at', { ascending: false });
  if (gameId) query = query.eq('game_id', gameId);
  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 按 id 获取秘籍 */
export async function adminGetCheatById(id: string): Promise<ApiResult<Cheat>> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('cheats').select('*').eq('id', id).single();
  if (error || !data) return fail('秘籍不存在');
  return ok(data);
}

/** 新增秘籍 */
export async function adminCreateCheat(data: CheatInsert): Promise<ApiResult<Cheat>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('cheats')
    .insert(data as never)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 更新秘籍 */
export async function adminUpdateCheat(id: string, data: CheatUpdate): Promise<ApiResult<Cheat>> {
  const supabase = createServerClient();
  const { data: row, error } = await supabase
    .from('cheats')
    .update(data as never)
    .eq('id', id)
    .select('*')
    .single();
  if (error) return fail(error.message);
  return ok(row);
}

/** 删除秘籍 */
export async function adminDeleteCheat(id: string): Promise<ApiResult<void>> {
  const supabase = createServerClient();
  const { error } = await supabase.from('cheats').delete().eq('id', id);
  if (error) return fail(error.message);
  return ok(undefined);
}
