import type { Metadata } from 'next';
import Link from 'next/link';
import { GameCard } from '@/components/GameCard';
import { getPublishedGames } from '@/lib/queries/games';
import { getFeaturedGuides, GUIDE_TYPE_LABELS } from '@/lib/queries/guides';
import { getPlatforms, getEmulatorGuides } from '@/lib/queries/platforms';
import { getLatestNews } from '@/lib/queries/news';

export const metadata: Metadata = {
  title: 'Retro Game Wiki - 中文经典游戏百科站',
  description:
    '中文经典游戏知识库 · 提供 FC/SFC/GBA/PS1 等平台的攻略 Wiki、游戏数据库与模拟器教程',
  alternates: { canonical: '/' },
};

/** 格式化日期 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

export default async function HomePage() {
  const [gamesResult, guidesResult, platformsResult, newsResult, emulatorsResult] = await Promise.all([
    getPublishedGames({ page: 1, pageSize: 8 }),
    getFeaturedGuides(6),
    getPlatforms(),
    getLatestNews(5),
    getEmulatorGuides(),
  ]);

  const games = gamesResult.success ? gamesResult.data.items : [];
  const guides = guidesResult.success ? guidesResult.data : [];
  const platforms = platformsResult.success ? platformsResult.data : [];
  const newsList = newsResult.success ? newsResult.data : [];
  const emulatorGuides = (emulatorsResult.success ? emulatorsResult.data : []).slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Retro Game Wiki',
    alternateName: '中文经典游戏百科站',
    url: siteUrl,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/games?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Retro Game Wiki
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            中文经典游戏百科站 · 攻略 Wiki / 游戏数据库 / 模拟器资料
          </p>
          <p className="mt-2 text-sm text-gray-400">
            覆盖 FC / SFC / GBA / PS1 / PSP / NDS 等经典平台
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/games"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              浏览游戏库
            </Link>
            <Link
              href="/guides"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              查看攻略
            </Link>
          </div>
        </div>
      </section>

      {/* 平台导航 */}
      {platforms.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">按平台浏览</h2>
            <Link href="/games" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
            {platforms.map((p) => (
              <Link
                key={p.id}
                href={`/platform/${p.slug}`}
                className="group rounded-lg border border-gray-200 p-3 text-center transition hover:border-gray-400 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-600"
              >
                <p className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {p.name}
                </p>
                {p.release_year && (
                  <p className="mt-0.5 text-xs text-gray-400">{p.release_year}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 精选游戏 */}
      {games.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">精选游戏</h2>
            <Link href="/games" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              更多 →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* 精选攻略 */}
      {guides.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">精选攻略</h2>
            <Link href="/guides" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              更多 →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.id}
                className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {GUIDE_TYPE_LABELS[guide.guide_type] || guide.guide_type}
                  </span>
                  <span>· {formatDate(guide.updated_at)}</span>
                </div>
                <h3 className="mt-2 font-semibold">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {guide.title}
                  </Link>
                </h3>
                {guide.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {guide.summary}
                  </p>
                )}
                {guide.game && (
                  <div className="mt-2 text-sm">
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
        </section>
      )}

      {/* 模拟器教程推荐 */}
      {emulatorGuides.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">模拟器教程</h2>
            <Link href="/emulators" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              更多 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {emulatorGuides.map((eg) => (
              <Link
                key={eg.id}
                href={`/emulators/${eg.slug}`}
                className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{eg.title}</h3>
                {eg.platform && (
                  <p className="mt-1 text-xs text-gray-400">{eg.platform.name}</p>
                )}
                {eg.software && (
                  <p className="mt-1 text-xs text-blue-500">{eg.software}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最新新闻 */}
      {newsList.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">最新资讯</h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {newsList.map((news) => (
              <li key={news.id} className="py-3">
                <Link
                  href={`/news/${news.slug}`}
                  className="flex items-center justify-between gap-4 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{news.title}</span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {news.published_at ? formatDate(news.published_at) : formatDate(news.updated_at)}
                  </span>
                </Link>
                {news.source && (
                  <p className="mt-0.5 text-xs text-gray-400">来源：{news.source}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </div>
  );
}
