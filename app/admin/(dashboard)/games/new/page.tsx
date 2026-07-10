import { GameForm } from '@/components/admin/GameForm';
import { getPlatforms, getGenres } from '@/lib/queries/platforms';

export const metadata = { title: '新增游戏 · 后台' };

export default async function NewGamePage() {
  const [platformsRes, genresRes] = await Promise.all([getPlatforms(), getGenres()]);
  const platforms = platformsRes.success ? platformsRes.data : [];
  const genres = genresRes.success ? genresRes.data : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增游戏</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <GameForm platforms={platforms} genres={genres} />
      </div>
    </div>
  );
}
