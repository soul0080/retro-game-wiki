/**
 * 游戏查询
 * 对应 docs/02-database-schema.md §4, §5, §7
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Game, Platform, Genre, Tag, Character, Boss, Item, Cheat, GameWithRelations } from '@/types/database';

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
  genreSlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ items: GameListItem[]; total: number }>> {
  const { platformSlug, genreSlug, page = 1, pageSize = 24 } = options || {};
  const supabase = createServerClient();

  // 收集筛选条件对应的 game_id 集合（取交集）
  const idSets: string[][] = [];

  // 若按平台筛选，先取该平台下的 game_id 集合
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
    const ids = ((gp || []) as { game_id: string }[]).map((r) => r.game_id);
    if (ids.length === 0) return ok({ items: [], total: 0 });
    idSets.push(ids);
  }

  // 若按类型筛选，先取该类型下的 game_id 集合
  if (genreSlug) {
    const { data, error: gErr } = await supabase
      .from('genres')
      .select('*')
      .eq('slug', genreSlug)
      .single();
    if (gErr || !data) return ok({ items: [], total: 0 });
    const genre: Genre = data;
    const { data: gg } = await supabase
      .from('game_genres')
      .select('*')
      .eq('genre_id', genre.id);
    const ids = ((gg || []) as { game_id: string }[]).map((r) => r.game_id);
    if (ids.length === 0) return ok({ items: [], total: 0 });
    idSets.push(ids);
  }

  // 取所有筛选集合的交集
  let scopedGameIds: string[] | null = null;
  if (idSets.length > 0) {
    scopedGameIds = idSets.reduce((acc, set) => acc.filter((id) => set.includes(id)));
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

/** 获取所有已发布游戏的 slug + updated_at（sitemap 用） */
export async function getPublishedGameSlugs(): Promise<ApiResult<{ slug: string; updated_at: string }[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('games')
    .select('slug, updated_at')
    .eq('status', 'published');
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

/** 获取游戏的角色列表 */
export async function getCharactersByGameId(gameId: string): Promise<ApiResult<Character[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true });
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 获取游戏的 Boss 列表 */
export async function getBossesByGameId(gameId: string): Promise<ApiResult<Boss[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('bosses')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true });
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 获取游戏的道具列表 */
export async function getItemsByGameId(gameId: string): Promise<ApiResult<Item[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true });
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 获取游戏的秘籍列表 */
export async function getCheatsByGameId(gameId: string): Promise<ApiResult<Cheat[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cheats')
    .select('*')
    .eq('game_id', gameId)
    .order('created_at', { ascending: true });
  if (error) return fail(error.message);
  return ok(data || []);
}
