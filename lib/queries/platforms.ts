/**
 * 平台与类型查询
 * 对应 docs/02-database-schema.md §3, §6
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Platform, Genre } from '@/types/database';

/** 获取所有平台（按发行年份排序） */
export async function getPlatforms(): Promise<ApiResult<Platform[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('release_year', { ascending: true });

  if (error) return fail(error.message);
  return ok(data);
}

/** 按 slug 获取平台 */
export async function getPlatformBySlug(slug: string): Promise<ApiResult<Platform>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return fail(error.message);
  if (!data) return fail('平台不存在');
  return ok(data);
}

/** 获取所有游戏类型 */
export async function getGenres(): Promise<ApiResult<Genre[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name');

  if (error) return fail(error.message);
  return ok(data);
}
