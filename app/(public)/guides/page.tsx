import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Pagination } from '@/components/Pagination';
import { getPublishedGuides, GUIDE_TYPE_LABELS } from '@/lib/queries/guides';

export const metadata: Metadata = {
  title: '攻略',
  description: '浏览所有经典游戏攻略 - 主线流程、Boss 战、支线任务、秘籍隐藏等',
};

const PAGE_SIZE = 20;

/** 格式化日期 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const guideType = params.type;

  const result = await getPublishedGuides({ guideType, page, pageSize: PAGE_SIZE });
  const guides = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;

  const paginationBase = guideType ? `/guides?type=${guideType}` : '/guides';
  const activeTypeLabel = guideType ? GUIDE_TYPE_LABELS[guideType] : undefined;

  // 可选类型筛选
  const typeFilters = Object.entries(GUIDE_TYPE_LABELS);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Breadcrumb items={[{ name: '首页', href: '/' }, { name: '攻略', href: '/guides' }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeTypeLabel ? `${activeTypeLabel} 攻略` : '游戏攻略'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">共 {total} 篇攻略</p>
      </div>

      {/* 类型筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/guides"
          className={`rounded-full px-3 py-1 text-sm ${
            !guideType
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          全部
        </Link>
        {typeFilters.map(([value, label]) => (
          <Link
            key={value}
            href={`/guides?type=${value}`}
            className={`rounded-full px-3 py-1 text-sm ${
              guideType === value
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 攻略列表 */}
      {guides.length > 0 ? (
        <div className="space-y-4">
          {guides.map((guide) => (
            <article
              key={guide.id}
              className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {GUIDE_TYPE_LABELS[guide.guide_type] || guide.guide_type}
                </span>
                {guide.is_featured && <span className="text-amber-500">★ 精选</span>}
                {guide.difficulty && <span>难度：{guide.difficulty}</span>}
                <span>· {formatDate(guide.updated_at)}</span>
              </div>

              <h2 className="mt-2 text-lg font-semibold">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                >
                  {guide.title}
                </Link>
              </h2>

              {guide.summary && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {guide.summary}
                </p>
              )}

              {guide.game && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">所属游戏：</span>
                  <Link
                    href={`/games/${guide.game.slug}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {guide.game.name_cn}
                  </Link>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl">📖</p>
          <p className="mt-2">暂无攻略数据</p>
        </div>
      )}

      <div className="mt-8">
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath={paginationBase} />
      </div>
    </div>
  );
}
