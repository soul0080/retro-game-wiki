import { EmulatorGuideForm } from '@/components/admin/EmulatorGuideForm';
import { getPlatforms } from '@/lib/queries/admin';

export const metadata = { title: '新增模拟器教程 · 后台' };

export default async function NewEmulatorGuidePage() {
  const result = await getPlatforms();
  const platforms = result.success ? result.data : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新增模拟器教程</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <EmulatorGuideForm platforms={platforms} />
      </div>
    </div>
  );
}
