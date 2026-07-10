import Link from 'next/link';
import { adminGetStats } from '@/lib/queries/admin';

export const metadata = { title: '仪表盘 · 后台' };

export default async function AdminDashboardPage() {
  const result = await adminGetStats();
  const stats = result.success
    ? result.data
    : { games: 0, guides: 0, publishedGames: 0, publishedGuides: 0, platforms: 0 };

  const cards = [
    { label: '游戏总数', value: stats.games, sub: `已发布 ${stats.publishedGames}`, href: '/admin/games' },
    { label: '攻略总数', value: stats.guides, sub: `已发布 ${stats.publishedGuides}`, href: '/admin/guides' },
    { label: '平台总数', value: stats.platforms, sub: '基础数据', href: '/admin' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
      <p className="mt-1 text-sm text-gray-500">内容管理总览</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-gray-200 bg-white p-5 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{c.value}</p>
            <p className="mt-1 text-xs text-gray-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">快捷操作</h2>
        <div className="mt-3 flex gap-3">
          <Link
            href="/admin/games/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
          >
            + 新增游戏
          </Link>
          <Link
            href="/admin/guides/new"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            + 新增攻略
          </Link>
        </div>
      </div>
    </div>
  );
}
