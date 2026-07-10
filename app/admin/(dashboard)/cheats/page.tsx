import Link from 'next/link';
import { adminGetCheats, adminGetGames } from '@/lib/queries/admin';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: '秘籍管理 · 后台' };

export default async function AdminCheatsPage() {
  const [cheatsRes, gamesRes] = await Promise.all([
    adminGetCheats(),
    adminGetGames({ pageSize: 200 }),
  ]);
  const cheats = cheatsRes.success ? cheatsRes.data : [];
  const games = gamesRes.success ? gamesRes.data.items : [];

  // 构建 game_id -> game 映射，用于显示所属游戏名
  const gameMap = new Map(games.map((g) => [g.id, g.name_cn]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">秘籍管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {cheats.length} 条秘籍</p>
        </div>
        <Link
          href="/admin/cheats/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增秘籍
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">所属游戏</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">代码</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {cheats.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">暂无秘籍</td>
              </tr>
            ) : (
              cheats.map((cheat) => (
                <tr key={cheat.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {cheat.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {gameMap.get(cheat.game_id) || cheat.game_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {cheat.code || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(cheat.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/cheats/${cheat.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/admin/cheats/${cheat.id}`} />
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
