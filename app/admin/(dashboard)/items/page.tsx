import Link from 'next/link';
import { adminGetItems, adminGetGames } from '@/lib/queries/admin';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: '道具管理 · 后台' };

const ITEM_TYPE_LABELS: Record<string, string> = {
  weapon: '武器',
  armor: '防具',
  magic: '魔法',
  item: '道具',
  accessory: '配饰',
};

export default async function AdminItemsPage() {
  const [itemsRes, gamesRes] = await Promise.all([
    adminGetItems(),
    adminGetGames({ pageSize: 200 }),
  ]);
  const items = itemsRes.success ? itemsRes.data : [];
  const games = gamesRes.success ? gamesRes.data.items : [];

  // 构建 game_id -> game 映射，用于显示所属游戏名
  const gameMap = new Map(games.map((g) => [g.id, g.name_cn]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">道具管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {items.length} 个道具</p>
        </div>
        <Link
          href="/admin/items/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增道具
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">所属游戏</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">稀有度</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">暂无道具</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {gameMap.get(item.game_id) || item.game_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {ITEM_TYPE_LABELS[item.type] || item.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.rarity || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/items/${item.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/admin/items/${item.id}`} />
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
