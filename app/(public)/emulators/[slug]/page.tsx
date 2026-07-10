import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getEmulatorGuideBySlug } from '@/lib/queries/platforms';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEmulatorGuideBySlug(slug);
  if (!result.success) return { title: '教程不存在' };
  const guide = result.data;
  return {
    title: `${guide.title} - 模拟器教程`,
    description: guide.content?.slice(0, 160) || `${guide.title} 安装配置教程`,
  };
}

export default async function EmulatorGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getEmulatorGuideBySlug(slug);
  if (!result.success) notFound();
  const guide = result.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { name: '首页', href: '/' },
          { name: '模拟器', href: '/emulators' },
          { name: guide.title, href: `/emulators/${slug}` },
        ]}
      />

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{guide.title}</h1>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          {guide.platform && (
            <span>
              平台：
              <Link href={`/platform/${guide.platform.slug}`} className="text-blue-600 hover:underline">
                {guide.platform.name}
              </Link>
            </span>
          )}
          {guide.software && <span>软件：{guide.software}</span>}
        </div>

        {guide.content && (
          <div className="prose prose-gray mt-8 max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.content}</ReactMarkdown>
          </div>
        )}

        {guide.recommended_setting && (
          <section className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">推荐设置</h2>
            <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">
              {JSON.stringify(guide.recommended_setting, null, 2)}
            </pre>
          </section>
        )}
      </article>
    </div>
  );
}
