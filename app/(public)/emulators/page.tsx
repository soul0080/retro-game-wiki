import type { Metadata } from 'next';
import { getPlatforms } from '@/lib/queries/platforms';
import { PlatformBadge } from '@/components/PlatformBadge';

export const metadata: Metadata = {
  title: '模拟器教程 - Retro Game Wiki',
  description: '经典游戏平台模拟器安装与配置教程',
};

export default async function EmulatorsPage() {
  const platformsRes = await getPlatforms();
  const platforms = platformsRes.success ? platformsRes.data : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">模拟器教程</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        经典游戏平台模拟器安装与配置指南
      </p>

      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        📢 内容建设中，敬请期待
      </div>

      {platforms.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">支持的平台</h2>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <PlatformBadge key={p.id} platform={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
