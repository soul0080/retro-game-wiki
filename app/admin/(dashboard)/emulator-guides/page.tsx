import Link from 'next/link';
import { adminGetEmulatorGuides, getPlatforms } from '@/lib/queries/admin';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: '模拟器教程管理 · 后台' };

export default async function AdminEmulatorGuidesPage() {
  const [guidesResult, platformsResult] = await Promise.all([
    adminGetEmulatorGuides(),
    getPlatforms(),
  ]);
  const guides = guidesResult.success ? guidesResult.data : [];
  const platforms = platformsResult.success ? platformsResult.data : [];

  // 构建 platform_id -> platform 名称的映射
  const platformMap = new Map(platforms.map((p) => [p.id, p.name]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">模拟器教程管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {guides.length} 篇教程</p>
        </div>
        <Link
          href="/admin/emulator-guides/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增教程
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">平台</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">软件</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {guides.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">暂无教程</td>
              </tr>
            ) : (
              guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {guide.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {platformMap.get(guide.platform_id) || guide.platform_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {guide.software || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(guide.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/emulator-guides/${guide.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/admin/emulator-guides/${guide.id}`} />
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
