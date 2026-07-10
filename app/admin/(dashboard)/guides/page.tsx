import Link from 'next/link';
import { adminGetGuides } from '@/lib/queries/admin';
import { GUIDE_TYPE_LABELS } from '@/lib/queries/guides';

export const metadata = { title: '攻略管理 · 后台' };

const STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  review: '审核中',
  published: '已发布',
  archived: '已归档',
};

export default async function AdminGuidesPage() {
  const result = await adminGetGuides({ pageSize: 50 });
  const guides = result.success ? result.data.items : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">攻略管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {guides.length} 篇攻略</p>
        </div>
        <Link
          href="/admin/guides/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增攻略
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {guides.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">暂无攻略</td>
              </tr>
            ) : (
              guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {guide.title}
                    {guide.is_featured && <span className="ml-1 text-amber-500">★</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {GUIDE_TYPE_LABELS[guide.guide_type] || guide.guide_type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {STATUS_LABELS[guide.status] || guide.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(guide.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/guides/${guide.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    {guide.status === 'published' && (
                      <Link
                        href={`/guides/${guide.slug}`}
                        target="_blank"
                        className="ml-3 text-gray-500 hover:underline"
                      >
                        查看
                      </Link>
                    )}
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
