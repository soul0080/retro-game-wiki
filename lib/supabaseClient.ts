/**
 * Supabase 客户端
 *
 * 提供两套客户端：
 * - createServerClient：服务端用（Server Components / Server Actions），使用 service_role key 绕过 RLS
 * - createBrowserClient：浏览器端用（Client Components），使用 anon key 受 RLS 限制
 *
 * 文档：docs/02-database-schema.md
 */

import { createClient as supabaseCreateClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * 服务端客户端（Server Components / Server Actions）
 *
 * - 有 service_role key 时使用 service_role（绕过 RLS，用于后台写操作）
 * - 无 service_role key 时降级为 anon（用于前台只读操作）
 */
export function createServerClient() {
  const key = SERVICE_ROLE_KEY || ANON_KEY;
  return supabaseCreateClient<Database>(SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
}

/**
 * 浏览器端客户端（Client Components）
 *
 * 使用 anon key，受 RLS 策略限制，只能读取 published 内容。
 */
export function createBrowserClient() {
  return supabaseCreateClient<Database>(SUPABASE_URL, ANON_KEY);
}
