import { BossForm } from '@/components/admin/BossForm';
import { adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '新增 Boss · 后台' };

export default async function NewBossPage() {
  const result = await adminGetGames({ pageSize: 200 });
  const games = result.success ? result.data.items : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增 Boss</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <BossForm games={games} />
      </div>
    </div>
  );
}
