import { NextResponse, type NextRequest } from 'next/server';
import { adminUpdateGame, adminDeleteGame, adminSetGamePlatforms, adminSetGameGenres } from '@/lib/queries/admin';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { platforms, genres, ...gameData } = body;

  // 移除不可更新字段
  delete gameData.id;
  delete gameData.created_at;
  delete gameData.updated_at;

  const result = await adminUpdateGame(id, gameData);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }

  if (Array.isArray(platforms)) {
    await adminSetGamePlatforms(id, platforms);
  }
  if (Array.isArray(genres)) {
    await adminSetGameGenres(id, genres);
  }

  return NextResponse.json({ success: true, data: result.data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await adminDeleteGame(id);
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
