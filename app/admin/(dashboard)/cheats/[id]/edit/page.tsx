import { notFound } from 'next/navigation';
import { CheatForm } from '@/components/admin/CheatForm';
import { adminGetCheatById, adminGetGames, getPlatforms } from '@/lib/queries/admin';

export const metadata = { title: '编辑秘籍 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCheatPage({ params }: PageProps) {
  const { id } = await params;

  const [cheatResult, gamesResult, platformsResult] = await Promise.all([
    adminGetCheatById(id),
    adminGetGames({ pageSize: 200 }),
    getPlatforms(),
  ]);

  if (!cheatResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑秘籍：{cheatResult.data.title}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CheatForm
          cheat={cheatResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
          platforms={platformsResult.success ? platformsResult.data : []}
        />
      </div>
    </div>
  );
}
