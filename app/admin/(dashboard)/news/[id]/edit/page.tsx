import { notFound } from 'next/navigation';
import { NewsForm } from '@/components/admin/NewsForm';
import { adminGetNewsById, adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '编辑新闻 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: PageProps) {
  const { id } = await params;

  const [newsResult, gamesResult] = await Promise.all([
    adminGetNewsById(id),
    adminGetGames({ pageSize: 200 }),
  ]);

  if (!newsResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑新闻：{newsResult.data.title}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <NewsForm
          news={newsResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
        />
      </div>
    </div>
  );
}
