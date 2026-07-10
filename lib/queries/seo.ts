/**
 * SEO 元数据查询
 * 对应 docs/02-database-schema.md seo_metadata 表
 * 唯一 SEO 数据源（project_memory 硬约束）
 */

import { createServerClient } from '@/lib/supabaseClient';
import { ok, fail, type ApiResult } from '@/lib/api';
import type { SeoMetadata, SeoEntityType } from '@/types/database';

/** 获取实体的 SEO 元数据（可能无记录） */
export async function getSeoMetadata(
  entityType: SeoEntityType,
  entityId: string
): Promise<ApiResult<SeoMetadata | null>> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('seo_metadata')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .maybeSingle();
  if (error) return fail(error.message);
  return ok(data);
}
