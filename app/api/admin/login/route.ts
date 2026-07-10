import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'rgw_admin';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ success: false, error: '未配置 ADMIN_PASSWORD' }, { status: 500 });
  }
  if (password !== expected) {
    return NextResponse.json({ success: false, error: '密码错误' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, 'authed', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });
  return res;
}
