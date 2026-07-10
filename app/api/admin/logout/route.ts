import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'rgw_admin';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
