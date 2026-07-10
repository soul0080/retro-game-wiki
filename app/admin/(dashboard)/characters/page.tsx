import Link from 'next/link';
import { adminGetCharacters, adminGetGames } from '@/lib/queries/admin';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: '角色管理 · 后台' };

export default async function AdminCharactersPage() {
  const [charactersRes, gamesRes] = await Promise.all([
    adminGetCharacters(),
    adminGetGames({ pageSize: 200 }),
  ]);
  const characters = charactersRes.success ? charactersRes.data : [];
  const games = gamesRes.success ? gamesRes.data.items : [];

  // 构建 game_id -> game 映射，用于显示所属游戏名
  const gameMap = new Map(games.map((g) => [g.id, g.name_cn]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">角色管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {characters.length} 个角色</p>
        </div>
        <Link
          href="/admin/characters/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增角色
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">所属游戏</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">昵称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {characters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">暂无角色</td>
              </tr>
            ) : (
              characters.map((character) => (
                <tr key={character.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {character.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {gameMap.get(character.game_id) || character.game_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {character.nickname || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(character.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/characters/${character.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/admin/characters/${character.id}`} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
