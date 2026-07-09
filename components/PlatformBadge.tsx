import Link from 'next/link';
import type { Platform } from '@/types/database';

/**
 * 平台徽章
 * 用于游戏卡片、详情页展示游戏所属平台
 */
const PLATFORM_COLORS: Record<string, string> = {
  fc: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  sfc: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  gba: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ps1: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  psp: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  nds: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export function PlatformBadge({ platform }: { platform: Pick<Platform, 'slug' | 'name'> }) {
  const colorClass = PLATFORM_COLORS[platform.slug] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <Link
      href={`/platform/${platform.slug}`}
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {platform.name}
    </Link>
  );
}
