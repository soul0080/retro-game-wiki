/**
 * 新闻公开查询
 * 仅返回已发布（published）的新闻
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { News } from '@/types/database';

/** 获取最新已发布新闻（首页用） */
export async function getLatestNews(limit = 5): Promise<ApiResult<News[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) return fail(error.message);
  return ok(data || []);
}

/** 获取已发布新闻列表（新闻列表页用） */
export async function getPublishedNews(options?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResult<{ items: News[]; total: number }>> {
  const { page = 1, pageSize = 20 } = options || {};
  const supabase = createServerClient();
  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (error) return fail(error.message);
  return ok({ items: data || [], total: count || 0 });
}

/** 按 slug 获取已发布新闻 */
export async function getNewsBySlug(slug: string): Promise<ApiResult<News>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error || !data) return fail('新闻不存在');
  return ok(data);
}

/** 获取所有已发布新闻 slug（sitemap 用） */
export async function getPublishedNewsSlugs(): Promise<ApiResult<{ slug: string; updated_at: string }[]>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('news')
    .select('slug, updated_at')
    .eq('status', 'published');
  if (error) return fail(error.message);
  return ok(data || []);
}
