import { ItemForm } from '@/components/admin/ItemForm';
import { adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '新增道具 · 后台' };

export default async function NewItemPage() {
  const result = await adminGetGames({ pageSize: 200 });
  const games = result.success ? result.data.items : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增道具</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <ItemForm games={games} />
      </div>
    </div>
  );
}
