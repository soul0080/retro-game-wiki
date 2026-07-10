import { notFound } from 'next/navigation';
import { ItemForm } from '@/components/admin/ItemForm';
import { adminGetItemById, adminGetGames } from '@/lib/queries/admin';

export const metadata = { title: '编辑道具 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: PageProps) {
  const { id } = await params;

  const [itemResult, gamesResult] = await Promise.all([
    adminGetItemById(id),
    adminGetGames({ pageSize: 200 }),
  ]);

  if (!itemResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑道具：{itemResult.data.name}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <ItemForm
          item={itemResult.data}
          games={gamesResult.success ? gamesResult.data.items : []}
        />
      </div>
    </div>
  );
}
