import Link from 'next/link';
import { SiteNav } from './SiteNav';

/**
 * 站点头部
 * 包含 Logo + 主导航 + 搜索入口
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
          <span className="text-lg">🎮</span>
          <span className="hidden sm:inline">Retro Game Wiki</span>
          <span className="sm:hidden">RGW</span>
        </Link>

        <SiteNav className="flex-1" />

        <Link
          href="/search"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          🔍 搜索
        </Link>
      </div>
    </header>
  );
}
