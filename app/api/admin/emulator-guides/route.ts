import { NextResponse, type NextRequest } from 'next/server';
import { adminCreateEmulatorGuide } from '@/lib/queries/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.slug || !body.platform_id) {
    return NextResponse.json(
      { success: false, error: '缺少必填字段 title/slug/platform_id' },
      { status: 400 }
    );
  }

  const result = await adminCreateEmulatorGuide(body);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: result.data });
}
