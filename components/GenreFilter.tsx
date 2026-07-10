import Link from 'next/link';
import type { Genre } from '@/types/database';

/**
 * 类型筛选栏
 * 用于游戏库列表页的类型筛选（与平台筛选共存）
 */

interface GenreFilterProps {
  genres: Genre[];
  activeSlug?: string;
  // 当前 platform 筛选，用于在切换 genre 时保留 platform
  platformSlug?: string;
}

export function GenreFilter({ genres, activeSlug, platformSlug }: GenreFilterProps) {
  const buildHref = (genreSlug?: string) => {
    const params = new URLSearchParams();
    if (platformSlug) params.set('platform', platformSlug);
    if (genreSlug) params.set('genre', genreSlug);
    const qs = params.toString();
    return qs ? `/games?${qs}` : '/games';
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref()}
        className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
          !activeSlug
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        全部类型
      </Link>
      {genres.map((g) => (
        <Link
          key={g.id}
          href={buildHref(g.slug)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeSlug === g.slug
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {g.name}
        </Link>
      ))}
    </div>
  );
}
