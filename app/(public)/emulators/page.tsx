import type { Metadata } from 'next';
import Link from 'next/link';
import { getPlatforms, getEmulatorGuides } from '@/lib/queries/platforms';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: '模拟器教程 - Retro Game Wiki',
  description: '经典游戏平台模拟器安装与配置教程',
};

export default async function EmulatorsPage() {
  const [platformsRes, guidesRes] = await Promise.all([getPlatforms(), getEmulatorGuides()]);
  const platforms = platformsRes.success ? platformsRes.data : [];
  const guides = guidesRes.success ? guidesRes.data : [];

  // 按平台分组教程
  const guidesByPlatform = new Map<string, typeof guides>();
  for (const g of guides) {
    const key = g.platform_id;
    if (!guidesByPlatform.has(key)) guidesByPlatform.set(key, []);
    guidesByPlatform.get(key)!.push(g);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ name: '首页', href: '/' }, { name: '模拟器', href: '/emulators' }]} />

      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">模拟器教程</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          经典游戏平台模拟器安装与配置指南
        </p>
      </div>

      {guides.length === 0 ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          📢 内容建设中，敬请期待
        </div>
      ) : (
        <div className="space-y-8">
          {platforms.map((platform) => {
            const platformGuides = guidesByPlatform.get(platform.id) || [];
            if (platformGuides.length === 0) return null;
            return (
              <section key={platform.id}>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {platform.name}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    {platformGuides.length} 篇教程
                  </span>
                </h2>
                <ul className="space-y-2">
                  {platformGuides.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/emulators/${g.slug}`}
                        className="block rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:hover:border-blue-700 dark:hover:bg-blue-900/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {g.title}
                          </span>
                          {g.software && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                              {g.software}
                            </span>
                          )}
                        </div>
                        {g.content && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                            {g.content.replace(/[#*`]/g, '').slice(0, 120)}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
