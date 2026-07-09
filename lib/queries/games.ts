/**
 * 游戏查询
 * 对应 docs/02-database-schema.md §4, §5, §7
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Game, Platform, Genre, Tag, GameWithRelations } from '@/types/database';

/** 游戏列表项（含平台，用于卡片展示） */
export interface GameListItem extends Game {
  platforms: Pick<Platform, 'id' | 'name' | 'slug'>[];
}

/** 获取已发布游戏列表（分页 + 平台筛选）
 *  注：PostgREST 多对多 join（games↔platforms 经 game_platforms）在当前 schema cache 下
 *  不可用，故采用分步查询：先 games 分页，再批量取平台关联合并。
 */
export async function getPublishedGames(options?: {
  platformSlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ items: GameListItem[]; total: number }>> {
  const { platformSlug, page = 1, pageSize = 24 } = options || {};
  const supabase = createServerClient();

  // 若按平台筛选，先取该平台下的 game_id 集合
  let scopedGameIds: string[] | null = null;
  if (platformSlug) {
    const { data, error: pErr } = await supabase
      .from('platforms')
      .select('*')
      .eq('slug', platformSlug)
      .single();
    if (pErr || !data) return ok({ items: [], total: 0 });
    const platform: Platform = data;
    const { data: gp } = await supabase
      .from('game_platforms')
      .select('*')
      .eq('platform_id', platform.id);
    scopedGameIds = ((gp || []) as { game_id: string }[]).map((r) => r.game_id);
    if (scopedGameIds.length === 0) return ok({ items: [], total: 0 });
  }

  // 查当前页 games（带 count）
  let gamesQuery = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('release_year', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (scopedGameIds) gamesQuery = gamesQuery.in('id', scopedGameIds);

  const { data: gamesData, error, count } = await gamesQuery;
  if (error) return fail(error.message);

  const games: Game[] = gamesData || [];
  if (games.length === 0) return ok({ items: [], total: count || 0 });

  // 批量取这些 game 的平台关联（game_platforms→platforms 一对一关联可用）
  const { data: gpData } = await supabase
    .from('game_platforms')
    .select('game_id, platforms(*)')
    .in('game_id', games.map((g) => g.id));

  const platformsByGame = new Map<string, Platform[]>();
  for (const row of (gpData || []) as { game_id: string; platforms: Platform | null }[]) {
    if (!platformsByGame.has(row.game_id)) platformsByGame.set(row.game_id, []);
    if (row.platforms) platformsByGame.get(row.game_id)!.push(row.platforms);
  }

  const items: GameListItem[] = games.map((g) => ({
    ...g,
    platforms: (platformsByGame.get(g.id) || []).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
    })),
  }));

  return ok({ items, total: count || 0 });
}

/** 获取精选游戏（首页用） */
export async function getFeaturedGames(limit = 8): Promise<ApiResult<Game[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'published')
    .order('release_year', { ascending: false })
    .limit(limit);

  if (error) return fail(error.message);
  return ok(data);
}

/** 按 slug 获取游戏详情（含平台、类型、标签） */
export async function getGameBySlug(slug: string): Promise<ApiResult<GameWithRelations>> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return fail('游戏不存在');
  const game: Game = data;

  // 并行查询关联数据
  const [platformsRes, genresRes, tagsRes] = await Promise.all([
    supabase.from('game_platforms').select('platforms(*)').eq('game_id', game.id),
    supabase.from('game_genres').select('genres(*)').eq('game_id', game.id),
    supabase.from('game_tags').select('tags(*)').eq('game_id', game.id),
  ]);

  const platforms = ((platformsRes.data as { platforms: Platform }[] | null) || [])
    .map((r) => r.platforms)
    .filter((p): p is Platform => Boolean(p));
  const genres = ((genresRes.data as { genres: Genre }[] | null) || [])
    .map((r) => r.genres)
    .filter((g): g is Genre => Boolean(g));
  const tags = ((tagsRes.data as { tags: Tag }[] | null) || [])
    .map((r) => r.tags)
    .filter((t): t is Tag => Boolean(t));

  return ok({
    ...game,
    platforms,
    genres,
    tags,
  });
}

/** 获取某平台下的游戏（平台页用，分步查询绕过多对多 join） */
export async function getGamesByPlatformSlug(
  platformSlug: string,
  limit = 24
): Promise<ApiResult<Game[]>> {
  const supabase = createServerClient();

  const { data, error: pErr } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', platformSlug)
    .single();
  if (pErr || !data) return ok([]);
  const platform: Platform = data;

  const { data: gp } = await supabase
    .from('game_platforms')
    .select('*')
    .eq('platform_id', platform.id)
    .limit(limit);
  const gameIds = ((gp || []) as { game_id: string }[]).map((r) => r.game_id);
  if (gameIds.length === 0) return ok([]);

  const { data: gamesData, error } = await supabase
    .from('games')
    .select('*')
    .eq('status', 'published')
    .in('id', gameIds)
    .order('release_year', { ascending: false });

  if (error) return fail(error.message);
  return ok(gamesData || []);
}
