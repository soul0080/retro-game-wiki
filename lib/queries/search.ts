/**
 * 搜索查询
 * 第一阶段使用 ILIKE 模糊匹配（PostgreSQL FTS 默认不支持中文分词，见 project_memory）
 * 后续可升级为 zhparser/pg_jieba 等中文分词方案
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { Game, Guide } from '@/types/database';

export interface SearchResult {
  games: Game[];
  guides: Guide[];
  total: number;
}

/** 简单搜索：游戏名 + 攻略标题模糊匹配 */
export async function searchContent(keyword: string): Promise<ApiResult<SearchResult>> {
  const trimmed = keyword.trim();
  if (!trimmed) return ok({ games: [], guides: [], total: 0 });

  const supabase = createServerClient();
  const pattern = `%${trimmed}%`;

  const [gamesRes, guidesRes] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .or(`name_cn.ilike.${pattern},name_en.ilike.${pattern},description.ilike.${pattern}`)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(20),
    supabase
      .from('guides')
      .select('*')
      .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(20),
  ]);

  if (gamesRes.error) return fail(gamesRes.error.message);
  if (guidesRes.error) return fail(guidesRes.error.message);

  const games = (gamesRes.data || []) as Game[];
  const guides = (guidesRes.data || []) as Guide[];

  return ok({ games, guides, total: games.length + guides.length });
}
