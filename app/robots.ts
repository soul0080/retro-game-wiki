import type { MetadataRoute } from 'next';

/**
 * 动态 robots.txt
 * 对应 docs/07-seo-architecture.md §10
 * 允许：/（前台页面）
 * 禁止：/admin、/api（后台与 API 不需索引）
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
