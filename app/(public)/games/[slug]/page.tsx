import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PlatformBadge } from '@/components/PlatformBadge';
import { getGameBySlug } from '@/lib/queries/games';
import { getGuidesByGameId } from '@/lib/queries/guides';
import { getSeoMetadata } from '@/lib/queries/seo';
import type { GameWithRelations } from '@/types/database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 静态生成 SEO metadata（seo_metadata 表为唯一数据源） */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getGameBySlug(slug);
  if (!result.success) return { title: '游戏不存在' };

  const game = result.data;
  // 查询 seo_metadata（唯一数据源，无记录则 fallback 到游戏字段）
  const seoResult = await getSeoMetadata('game', game.id);
  const seo = seoResult.success ? seoResult.data : null;

  return {
    title: seo?.title || game.name_cn,
    description: seo?.description || game.description || `${game.name_cn} - 攻略、角色、Boss 资料`,
    keywords: seo?.keywords || undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    openGraph: seo?.og_image_url ? { images: [seo.og_image_url] } : undefined,
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getGameBySlug(slug);

  if (!result.success) notFound();
  const game: GameWithRelations = result.data;

  // 查询该游戏的攻略
  const guidesResult = await getGuidesByGameId(game.id);
  const guides = guidesResult.success ? guidesResult.data : [];

  // Game Schema.org 结构化数据（对应 docs/07-seo-architecture.md §8）
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name_cn,
    ...(game.name_en ? { alternateName: game.name_en } : {}),
    description: game.description || `${game.name_cn} - 攻略、角色、Boss 资料`,
    ...(game.developer ? { developer: { '@type': 'Organization', name: game.developer } } : {}),
    ...(game.publisher ? { publisher: { '@type': 'Organization', name: game.publisher } } : {}),
    ...(game.release_year ? { datePublished: String(game.release_year) } : {}),
    ...(game.cover_url ? { image: game.cover_url } : {}),
    ...(game.genres && game.genres.length > 0
      ? { genre: game.genres.map((g) => g.name).join(', ') }
      : {}),
    ...(game.platforms && game.platforms.length > 0
      ? { gamePlatform: game.platforms.map((p) => p.name) }
      : {}),
    url: `${siteUrl}/games/${game.slug}`,
    inLanguage: 'zh-CN',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { name: '首页', href: '/' },
          { name: '游戏库', href: '/games' },
          { name: game.name_cn, href: `/games/${game.slug}` },
        ]}
      />

      <div className="mt-6 grid gap-8 md:grid-cols-[300px_1fr]">
        {/* 左侧：封面 */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            {game.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={game.cover_url} alt={game.name_cn} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl text-gray-300 dark:text-gray-700">🎮</div>
            )}
          </div>
        </div>

        {/* 右侧：信息 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{game.name_cn}</h1>
          {game.name_en && <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">{game.name_en}</p>}
          {game.name_jp && <p className="text-sm text-gray-400">{game.name_jp}</p>}

          {/* 平台 */}
          {game.platforms && game.platforms.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">平台：</span>
              {game.platforms.map((p) => (
                <PlatformBadge key={p.id} platform={p} />
              ))}
            </div>
          )}

          {/* 基础信息 */}
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {game.release_year && (
              <div><dt className="inline text-gray-500">发行年份：</dt><dd className="inline text-gray-900 dark:text-gray-100">{game.release_year}</dd></div>
            )}
            {game.developer && (
              <div><dt className="inline text-gray-500">开发商：</dt><dd className="inline text-gray-900 dark:text-gray-100">{game.developer}</dd></div>
            )}
            {game.publisher && (
              <div><dt className="inline text-gray-500">发行商：</dt><dd className="inline text-gray-900 dark:text-gray-100">{game.publisher}</dd></div>
            )}
            {game.region && (
              <div><dt className="inline text-gray-500">地区：</dt><dd className="inline text-gray-900 dark:text-gray-100">{game.region}</dd></div>
            )}
          </dl>

          {/* 简介 */}
          {game.description && (
            <div className="mt-4">
              <h2 className="mb-1 font-semibold text-gray-900 dark:text-white">游戏简介</h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{game.description}</p>
            </div>
          )}

          {/* 故事梗概 */}
          {game.story_summary && (
            <div className="mt-4">
              <h2 className="mb-1 font-semibold text-gray-900 dark:text-white">故事梗概</h2>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{game.story_summary}</p>
            </div>
          )}
        </div>
      </div>

      {/* 攻略列表 */}
      {guides.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">攻略</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{guide.title}</h3>
                {guide.summary && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{guide.summary}</p>
                )}
                <span className="mt-2 inline-block text-xs text-gray-400">{guide.guide_type}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Game Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: game.name_cn,
            alternateName: game.name_en,
            datePublished: game.release_year?.toString(),
            developer: game.developer ? { '@type': 'Organization', name: game.developer } : undefined,
            publisher: game.publisher ? { '@type': 'Organization', name: game.publisher } : undefined,
            description: game.description,
          }),
        }}
      />
      {/* Game Schema.org 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
    </div>
  );
}

/** 预生成热门游戏的静态页（MVP 阶段用 slug 动态生成即可） */
export const dynamicParams = true;
