/**
 * 平台与类型查询
 * 对应 docs/02-database-schema.md §3, §6
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Platform, Genre, EmulatorGuide } from '@/types/database';

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

/** 获取所有模拟器教程（含平台信息） */
export async function getEmulatorGuides(): Promise<ApiResult<(EmulatorGuide & { platform: Platform | null })[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('emulator_guides')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) return fail(error.message);

  const guides = (data || []) as EmulatorGuide[];
  if (guides.length === 0) return ok([]);

  // 批量取平台信息（PostgREST 多对多 join 不可用，分步查询）
  const platformIds = [...new Set(guides.map((g) => g.platform_id))];
  const { data: platforms } = await supabase
    .from('platforms')
    .select('*')
    .in('id', platformIds);
  const platformMap = new Map<string, Platform>(
    ((platforms || []) as Platform[]).map((p) => [p.id, p])
  );

  return ok(guides.map((g) => ({ ...g, platform: platformMap.get(g.platform_id) || null })));
}

/** 按 slug 获取模拟器教程 */
export async function getEmulatorGuideBySlug(slug: string): Promise<ApiResult<EmulatorGuide & { platform: Platform | null }>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('emulator_guides')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return fail('教程不存在');
  const guide = data as EmulatorGuide;

  const { data: platform } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', guide.platform_id)
    .single();
  return ok({ ...guide, platform: (platform as Platform | null) || null });
}

/** 获取所有模拟器教程的 slug（sitemap 用） */
export async function getEmulatorGuideSlugs(): Promise<ApiResult<{ slug: string; updated_at: string }[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('emulator_guides')
    .select('slug, updated_at');
  if (error) return fail(error.message);
  return ok(data || []);
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
