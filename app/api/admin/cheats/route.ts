import { NextResponse, type NextRequest } from 'next/server';
import { adminCreateCheat } from '@/lib/queries/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.game_id) {
    return NextResponse.json(
      { success: false, error: '缺少必填字段 title/game_id' },
      { status: 400 }
    );
  }

  const result = await adminCreateCheat(body);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: result.data });
}
