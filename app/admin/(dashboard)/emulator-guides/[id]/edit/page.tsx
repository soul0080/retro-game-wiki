import { notFound } from 'next/navigation';
import { EmulatorGuideForm } from '@/components/admin/EmulatorGuideForm';
import { adminGetEmulatorGuideById, getPlatforms } from '@/lib/queries/admin';

export const metadata = { title: '编辑模拟器教程 · 后台' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEmulatorGuidePage({ params }: PageProps) {
  const { id } = await params;

  const [guideResult, platformsResult] = await Promise.all([
    adminGetEmulatorGuideById(id),
    getPlatforms(),
  ]);

  if (!guideResult.success) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        编辑模拟器教程：{guideResult.data.title}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <EmulatorGuideForm
          emulatorGuide={guideResult.data}
          platforms={platformsResult.success ? platformsResult.data : []}
        />
      </div>
    </div>
  );
}
