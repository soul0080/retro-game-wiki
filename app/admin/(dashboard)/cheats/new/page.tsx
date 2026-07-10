import { CheatForm } from '@/components/admin/CheatForm';
import { adminGetGames, getPlatforms } from '@/lib/queries/admin';

export const metadata = { title: '新增秘籍 · 后台' };

export default async function NewCheatPage() {
  const [gamesResult, platformsResult] = await Promise.all([
    adminGetGames({ pageSize: 200 }),
    getPlatforms(),
  ]);
  const games = gamesResult.success ? gamesResult.data.items : [];
  const platforms = platformsResult.success ? platformsResult.data : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增秘籍</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CheatForm games={games} platforms={platforms} />
      </div>
    </div>
  );
}
