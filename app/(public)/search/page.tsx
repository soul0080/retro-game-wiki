import type { Metadata } from 'next';
import Link from 'next/link';
import { searchContent, type SearchResult } from '@/lib/queries/search';
import { GUIDE_TYPE_LABELS } from '@/lib/queries/guides';

export const metadata: Metadata = {
  title: '搜索 - Retro Game Wiki',
  description: '搜索经典游戏、攻略、秘籍',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const keyword = q.trim();

  let results: SearchResult | null = null;
  if (keyword) {
    const res = await searchContent(keyword);
    if (res.success) {
      results = res.data;
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">搜索</h1>

      <form className="mt-4 flex gap-2" action="/search" method="GET">
        <input
          name="q"
          defaultValue={keyword}
          placeholder="输入游戏名、攻略标题…"
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
        >
          搜索
        </button>
      </form>

      {keyword && (
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {results ? `找到 ${results.total} 条结果` : '搜索中…'}
          </p>

          {results && results.games.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                游戏（{results.games.length}）
              </h2>
              <ul className="space-y-3">
                {results.games.map((game) => (
                  <li key={game.id}>
                    <Link
                      href={`/games/${game.slug}`}
                      className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {game.name_cn}
                          {game.name_en && (
                            <span className="ml-2 text-sm text-gray-400">{game.name_en}</span>
                          )}
                        </span>
                        {game.release_year && (
                          <span className="text-xs text-gray-400">{game.release_year}</span>
                        )}
                      </div>
                      {game.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {game.description}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results && results.guides.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                攻略（{results.guides.length}）
              </h2>
              <ul className="space-y-3">
                {results.guides.map((guide) => (
                  <li key={guide.id}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {guide.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {GUIDE_TYPE_LABELS[guide.guide_type] || guide.guide_type}
                        </span>
                      </div>
                      {guide.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {guide.summary}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results && results.total === 0 && (
            <p className="mt-8 text-center text-gray-400">
              未找到与「{keyword}」相关的内容
            </p>
          )}
        </div>
      )}

      {!keyword && (
        <p className="mt-8 text-center text-sm text-gray-400">
          输入关键词开始搜索，支持游戏名和攻略标题
        </p>
      )}
    </div>
  );
}
