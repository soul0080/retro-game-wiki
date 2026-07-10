/**
 * Admin 数据层
 * 使用 service_role key，可读写所有数据（含草稿）
 * 对应 docs/02-database-schema.md
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Game, Guide, Platform, Genre } from '@/types/database';

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
