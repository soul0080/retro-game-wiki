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

/** 获取已发布游戏列表（分页 + 平台筛选） */
export async function getPublishedGames(options?: {
  platformSlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ items: GameListItem[]; total: number }>> {
  const { platformSlug, page = 1, pageSize = 24 } = options || {};
  const supabase = createServerClient();

  let query = supabase
    .from('games')
    .select('*, platforms!game_platforms(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('release_year', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (platformSlug) {
    query = query.filter('platforms.slug', 'eq', platformSlug);
  }

  const { data, error, count } = await query;
  if (error) return fail(error.message);

  const items: GameListItem[] = (data || []).map((g) => {
    const { platforms, ...rest } = g as Game & { platforms?: Platform[] };
    return {
      ...rest,
      platforms: (platforms || []).map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
    };
  });

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

/** 获取某平台下的游戏（平台页用） */
export async function getGamesByPlatformSlug(
  platformSlug: string,
  limit = 24
): Promise<ApiResult<Game[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('games')
    .select('*, platforms!game_platforms(*)')
    .eq('status', 'published')
    .filter('platforms.slug', 'eq', platformSlug)
    .limit(limit);

  if (error) return fail(error.message);
  return ok(data);
}
