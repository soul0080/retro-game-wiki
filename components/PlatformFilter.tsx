import Link from 'next/link';
import type { Platform } from '@/types/database';

/**
 * 平台筛选栏
 * 用于游戏库列表页的平台筛选
 */

interface PlatformFilterProps {
  platforms: Platform[];
  activeSlug?: string;
  basePath?: string; // 默认 /games
}

export function PlatformFilter({
  platforms,
  activeSlug,
  basePath = '/games',
}: PlatformFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
          !activeSlug
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        全部
      </Link>
      {platforms.map((p) => (
        <Link
          key={p.id}
          href={`${basePath}?platform=${p.slug}`}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeSlug === p.slug
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {p.name}
        </Link>
      ))}
    </div>
  );
}
