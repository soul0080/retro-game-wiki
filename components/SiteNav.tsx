import Link from 'next/link';

/**
 * 站点导航
 * 一级路由：首页 / 游戏库 / 攻略 / 模拟器 / 专题
 */
const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '游戏库', href: '/games' },
  { label: '攻略', href: '/guides' },
  { label: '模拟器', href: '/emulators' },
  { label: '专题', href: '/topics' },
] as const;

export function SiteNav({ className = '' }: { className?: string }) {
  return (
    <nav className={className} aria-label="主导航">
      <ul className="flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
