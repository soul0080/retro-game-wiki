/**
 * 统一 API 返回结构
 * 对应 05-ai-agent-rules.md §API 统一返回结构
 */

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** 包装成功结果 */
export function ok<T>(data: T): ApiResult<T> {
  return { success: true, data };
}

/** 包装失败结果 */
export function fail<T = never>(error: string): ApiResult<T> {
  return { success: false, error };
}

/** 将 Supabase 查询结果包装为 ApiResult */
export function fromSupabase<T>(
  data: T | null,
  error: { message: string } | null
): ApiResult<T> {
  if (error) return fail(error.message);
  if (data === null) return fail('未找到数据');
  return ok(data);
}
