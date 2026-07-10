import { NextResponse, type NextRequest } from 'next/server';
import { adminCreateNews } from '@/lib/queries/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.slug) {
    return NextResponse.json(
      { success: false, error: '缺少必填字段 title/slug' },
      { status: 400 }
    );
  }

  const result = await adminCreateNews({
    ...body,
    status: body.status || 'draft',
  });
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: result.data });
}
