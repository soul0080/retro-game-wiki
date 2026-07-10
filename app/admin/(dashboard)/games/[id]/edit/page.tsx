import { notFound } from 'next/navigation';
import { GameForm } from '@/components/admin/GameForm';
import {
  adminGetGameById,
  adminGetGamePlatformIds,
  adminGetGameGenreIds,
} from '@/lib/queries/admin';
import { getPlatforms, getGenres } from '@/lib/queries/platforms';

export const metadata = { title: '编辑游戏 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGamePage({ params }: PageProps) {
  const { id } = await params;

  const [gameResult, platformsRes, genresRes, platformIdsRes, genreIdsRes] = await Promise.all([
    adminGetGameById(id),
    getPlatforms(),
    getGenres(),
    adminGetGamePlatformIds(id),
    adminGetGameGenreIds(id),
  ]);

  if (!gameResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑游戏：{gameResult.data.name_cn}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <GameForm
          game={gameResult.data}
          platforms={platformsRes.success ? platformsRes.data : []}
          genres={genresRes.success ? genresRes.data : []}
          selectedPlatformIds={platformIdsRes.success ? platformIdsRes.data : []}
          selectedGenreIds={genreIdsRes.success ? genreIdsRes.data : []}
        />
      </div>
    </div>
  );
}
