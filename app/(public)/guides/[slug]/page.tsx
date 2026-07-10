import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getGuideBySlug, GUIDE_TYPE_LABELS } from '@/lib/queries/guides';
import { getSeoMetadata } from '@/lib/queries/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getGuideBySlug(slug);
  if (!result.success) return { title: '攻略不存在' };
  const guide = result.data;
  // 查询 seo_metadata（唯一数据源，无记录则 fallback 到攻略字段）
  const seoResult = await getSeoMetadata('guide', guide.id);
  const seo = seoResult.success ? seoResult.data : null;
  return {
    title: seo?.title || guide.title,
    description: seo?.description || guide.summary || `${guide.title} - 详细攻略`,
    keywords: seo?.keywords || undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    openGraph: seo?.og_image_url ? { images: [seo.og_image_url] } : undefined,
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

/** 中文友好的 slug 生成（保留中文字符） */
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 从 React 节点提取纯文本（用于为标题生成与 TOC 一致的 id） */
function nodeToText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return nodeToText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

interface TocItem {
  level: 2 | 3;
  text: string;
  id: string;
}

/** 从 Markdown 文本提取 H2/H3 生成目录（跳过代码块内的伪标题） */
function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inCodeBlock = false;
  for (const line of markdown.split('\n')) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) {
      const level = m[1].length as 2 | 3;
      const text = m[2].trim();
      items.push({ level, text, id: slugify(text) });
    }
  }
  return items;
}

/** 估算阅读时长（中文每分钟约 400 字） */
function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.length / 400));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getGuideBySlug(slug);
  if (!result.success) notFound();
  const guide = result.data;

  const content = guide.content || '';
  const toc = extractToc(content);
  const minutes = readingTime(content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/guides/${guide.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.summary || undefined,
    datePublished: guide.created_at,
    dateModified: guide.updated_at,
    url,
    ...(guide.game ? { about: { '@type': 'VideoGame', name: guide.game.name_cn } } : {}),
  };

  // 为标题注入 id，使 TOC 锚点可跳转
  const markdownComponents = {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 id={slugify(nodeToText(children))}>{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 id={slugify(nodeToText(children))}>{children}</h3>
    ),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { name: '首页', href: '/' },
          { name: '攻略', href: '/guides' },
          { name: guide.title, href: `/guides/${guide.slug}` },
        ]}
      />

      <article className="mt-4 lg:grid lg:grid-cols-[1fr_220px] lg:gap-8">
        {/* 正文 */}
        <div className="min-w-0">
          <header className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {GUIDE_TYPE_LABELS[guide.guide_type] || guide.guide_type}
              </span>
              {guide.is_featured && <span className="text-amber-500">★ 精选</span>}
              {guide.difficulty && <span>难度：{guide.difficulty}</span>}
              <span>· 阅读约 {minutes} 分钟</span>
              <span>· 更新于 {formatDate(guide.updated_at)}</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {guide.title}
            </h1>

            {guide.summary && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{guide.summary}</p>
            )}

            {guide.game && (
              <div className="mt-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">所属游戏：</span>
                <Link
                  href={`/games/${guide.game.slug}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {guide.game.name_cn}
                </Link>
              </div>
            )}
          </header>

          <div className="prose prose-slate max-w-none dark:prose-invert">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">暂无内容</p>
            )}
          </div>
        </div>

        {/* 目录侧边栏 */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-6 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <h2 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">目录</h2>
              <ul className="space-y-1 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </div>
  );
}
