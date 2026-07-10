import { notFound } from 'next/navigation';
import { BossForm } from '@/components/admin/BossForm';
import { adminGetBossById, adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '编辑 Boss · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBossPage({ params }: PageProps) {
  const { id } = await params;

  const [bossResult, gamesResult] = await Promise.all([
    adminGetBossById(id),
    adminGetGames({ pageSize: 200 }),
  ]);

  if (!bossResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑 Boss：{bossResult.data.name}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <BossForm
          boss={bossResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
        />
      </div>
    </div>
  );
}
