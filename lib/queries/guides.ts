/**
 * 攻略查询
 * 对应 docs/02-database-schema.md §8, §9
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Guide, GuideSection, GuideWithRelations } from '@/types/database';

/** 攻略列表项（含游戏名，用于列表展示） */
export interface GuideListItem extends Guide {
  game: { id: string; name_cn: string; slug: string } | null;
}

/** 获取已发布攻略列表（分页） */
export async function getPublishedGuides(options?: {
  gameId?: string;
  guideType?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ items: GuideListItem[]; total: number }>> {
  const { gameId, guideType, page = 1, pageSize = 20 } = options || {};
  const supabase = createServerClient();

  let query = supabase
    .from('guides')
    .select('*, game:games(id, name_cn, slug)', { count: 'exact' })
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (gameId) query = query.eq('game_id', gameId);
  if (guideType) query = query.eq('guide_type', guideType);

  const { data, error, count } = await query;
  if (error) return fail(error.message);

  return ok({ items: data || [], total: count || 0 });
}

/** 获取精选攻略（首页用） */
export async function getFeaturedGuides(limit = 6): Promise<ApiResult<GuideListItem[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('guides')
    .select('*, game:games(id, name_cn, slug)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return fail(error.message);
  return ok(data);
}

/** 获取某游戏下的攻略 */
export async function getGuidesByGameId(gameId: string): Promise<ApiResult<Guide[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('game_id', gameId)
    .eq('status', 'published')
    .order('guide_type')
    .order('created_at');

  if (error) return fail(error.message);
  return ok(data);
}

/** 按 slug 获取攻略详情（含章节） */
export async function getGuideBySlug(slug: string): Promise<ApiResult<GuideWithRelations>> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('guides')
    .select('*, game:games(id, name_cn, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return fail('攻略不存在');
  const guide: Guide = data;

  const { data: sections } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('guide_id', guide.id)
    .order('order_number');

  return ok({
    ...guide,
    sections: sections || [],
  });
}

/** 获取攻略章节（用于分章渲染） */
export async function getGuideSections(guideId: string): Promise<ApiResult<GuideSection[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('guide_sections')
    .select('*')
    .eq('guide_id', guideId)
    .order('order_number');

  if (error) return fail(error.message);
  return ok(data);
}
