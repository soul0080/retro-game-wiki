import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Pagination } from '@/components/Pagination';
import { getPublishedNews } from '@/lib/queries/news';

export const metadata: Metadata = {
  title: '游戏资讯 - Retro Game Wiki',
  description: '经典游戏最新资讯与新闻动态',
};

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const result = await getPublishedNews({ page, pageSize: PAGE_SIZE });
  const news = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ name: '首页', href: '/' }, { name: '资讯', href: '/news' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">游戏资讯</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          共 {total} 篇资讯
        </p>
      </div>

      {news.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {news.map((item) => (
            <li key={item.id} className="py-4">
              <Link href={`/news/${item.slug}`} className="group block">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {item.title}
                </h2>
                {item.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.summary}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  {item.source && <span>来源：{item.source}</span>}
                  <span>
                    {item.published_at ? formatDate(item.published_at) : formatDate(item.updated_at)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl">📰</p>
          <p className="mt-2">暂无资讯</p>
        </div>
      )}

      <div className="mt-8">
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/news" />
      </div>
    </div>
  );
}
