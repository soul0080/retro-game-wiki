import { notFound } from 'next/navigation';
import { GuideForm } from '@/components/admin/GuideForm';
import { adminGetGuideById, adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '编辑攻略 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGuidePage({ params }: PageProps) {
  const { id } = await params;

  const [guideResult, gamesResult] = await Promise.all([
    adminGetGuideById(id),
    adminGetGames({ pageSize: 200 }),
  ]);

  if (!guideResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑攻略：{guideResult.data.title}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <GuideForm
          guide={guideResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
        />
      </div>
    </div>
  );
}
