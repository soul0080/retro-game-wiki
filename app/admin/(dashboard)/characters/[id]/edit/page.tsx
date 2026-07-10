import { notFound } from 'next/navigation';
import { CharacterForm } from '@/components/admin/CharacterForm';
import { adminGetCharacterById, adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '编辑角色 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCharacterPage({ params }: PageProps) {
  const { id } = await params;

  const [characterResult, gamesResult] = await Promise.all([
    adminGetCharacterById(id),
    adminGetGames({ pageSize: 200 }),
  ]);

  if (!characterResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑角色：{characterResult.data.name}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CharacterForm
          character={characterResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
        />
      </div>
    </div>
  );
}
