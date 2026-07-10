import { NextResponse, type NextRequest } from 'next/server';

/**
 * Admin 后台认证中间件
 * 保护 /admin/* 与 /api/admin/* 路由，未登录重定向到 /admin/login
 * 认证方式：httpOnly cookie（登录时设置），roadmap 明确不需要复杂权限
 */
const ADMIN_COOKIE = 'rgw_admin';
const LOGIN_PATH = '/admin/login';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 登录页本身与登录/登出 API 不拦截
  if (pathname === LOGIN_PATH || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token === 'authed') {
    return NextResponse.next();
  }

  // API 返回 401，页面重定向到登录
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });
  }
  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
