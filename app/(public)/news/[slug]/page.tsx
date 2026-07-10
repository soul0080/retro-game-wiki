import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getNewsBySlug } from '@/lib/queries/news';
import { getSeoMetadata } from '@/lib/queries/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [newsResult, seoResult] = await Promise.all([
    getNewsBySlug(slug),
    getSeoMetadata('news', slug),
  ]);
  if (!newsResult.success) return { title: '资讯不存在' };
  const news = newsResult.data;
  const seo = seoResult.success ? seoResult.data : null;

  return {
    title: seo?.title || `${news.title} - 游戏资讯`,
    description: seo?.description || news.summary || news.title,
    keywords: seo?.keywords || undefined,
    alternates: { canonical: seo?.canonical_url || undefined },
    openGraph: seo?.og_image_url ? { images: [seo.og_image_url] } : undefined,
    robots: seo?.noindex ? { index: false } : undefined,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getNewsBySlug(slug);
  if (!result.success) notFound();
  const news = result.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { name: '首页', href: '/' },
          { name: '资讯', href: '/news' },
          { name: news.title, href: `/news/${slug}` },
        ]}
      />

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{news.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {news.published_at && (
            <span>
              {new Date(news.published_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {news.source && (
            <span>
              来源：
              {news.source_url ? (
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {news.source}
                </a>
              ) : (
                news.source
              )}
            </span>
          )}
        </div>

        {news.cover_url && (
          <img
            src={news.cover_url}
            alt={news.title}
            className="mt-6 w-full rounded-lg object-cover"
          />
        )}

        {news.summary && !news.content && (
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">{news.summary}</p>
        )}

        {news.content && (
          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.content}</ReactMarkdown>
          </div>
        )}

        {news.related_game_id && (
          <p className="mt-8 text-sm text-gray-400">关联游戏 ID：{news.related_game_id}</p>
        )}
      </article>
    </div>
  );
}
