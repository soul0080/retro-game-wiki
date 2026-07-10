import { CharacterForm } from '@/components/admin/CharacterForm';
import { adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '新增角色 · 后台' };

export default async function NewCharacterPage() {
  const result = await adminGetGames({ pageSize: 200 });
  const games = result.success ? result.data.items : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增角色</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CharacterForm games={games} />
      </div>
    </div>
  );
}
