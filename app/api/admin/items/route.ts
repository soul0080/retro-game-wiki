import { NextResponse, type NextRequest } from 'next/server';
import { adminCreateItem } from '@/lib/queries/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.game_id || !body.type) {
    return NextResponse.json(
      { success: false, error: '缺少必填字段 name/game_id/type' },
      { status: 400 }
    );
  }

  const result = await adminCreateItem(body);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: result.data });
}
