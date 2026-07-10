import { NextResponse, type NextRequest } from 'next/server';
import { adminCreateGame, adminSetGamePlatforms, adminSetGameGenres } from '@/lib/queries/admin';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { platforms, genres, ...gameData } = body;

  if (!gameData.name_cn || !gameData.slug) {
    return NextResponse.json({ success: false, error: '缺少必填字段 name_cn/slug' }, { status: 400 });
  }

  const result = await adminCreateGame({
    ...gameData,
    status: gameData.status || 'draft',
  });
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }

  const gameId = result.data.id;
  if (Array.isArray(platforms) && platforms.length > 0) {
    await adminSetGamePlatforms(gameId, platforms);
  }
  if (Array.isArray(genres) && genres.length > 0) {
    await adminSetGameGenres(gameId, genres);
  }

  return NextResponse.json({ success: true, data: result.data });
}
