import { NextResponse, type NextRequest } from 'next/server';
import { adminUpdateGuide } from '@/lib/queries/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  delete body.id;
  delete body.created_at;
  delete body.updated_at;

  const result = await adminUpdateGuide(id, body);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true, data: result.data });
}
