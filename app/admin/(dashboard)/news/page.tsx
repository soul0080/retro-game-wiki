import Link from 'next/link';
import { adminGetNews } from '@/lib/queries/admin';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const metadata = { title: '新闻管理 · 后台' };

const STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  review: '审核中',
  published: '已发布',
  archived: '已归档',
};

export default async function AdminNewsPage() {
  const result = await adminGetNews();
  const newsList = result.success ? result.data : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新闻管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {newsList.length} 条新闻</p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          + 新增新闻
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">来源</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
            {newsList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">暂无新闻</td>
              </tr>
            ) : (
              newsList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.source || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/news/${item.id}/edit`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      编辑
                    </Link>
                    <DeleteButton endpoint={`/api/admin/news/${item.id}`} />
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
