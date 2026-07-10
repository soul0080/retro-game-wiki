import type { MetadataRoute } from 'next';
import { getPublishedGameSlugs } from '@/lib/queries/games';
import { getPublishedGuideSlugs } from '@/lib/queries/guides';
import { getPlatforms } from '@/lib/queries/platforms';

/**
 * 动态 sitemap.xml
 * 对应 docs/07-seo-architecture.md §9
 * 包含：首页、列表页、平台页、游戏详情页、攻略详情页
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  // 静态页面
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/games`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/guides`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ];

  // 平台页
  const platformsResult = await getPlatforms();
  const platformEntries: MetadataRoute.Sitemap = (platformsResult.success ? platformsResult.data : []).map((p) => ({
    url: `${siteUrl}/platform/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 游戏详情页
  const gamesResult = await getPublishedGameSlugs();
  const gameEntries: MetadataRoute.Sitemap = (gamesResult.success ? gamesResult.data : []).map((g) => ({
    url: `${siteUrl}/games/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 攻略详情页
  const guidesResult = await getPublishedGuideSlugs();
  const guideEntries: MetadataRoute.Sitemap = (guidesResult.success ? guidesResult.data : []).map((g) => ({
    url: `${siteUrl}/guides/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...platformEntries, ...gameEntries, ...guideEntries];
}
