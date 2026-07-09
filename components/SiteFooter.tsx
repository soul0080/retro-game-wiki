import Link from 'next/link';

/**
 * 站点底部
 * 版权 + 友链
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Retro Game Wiki</p>
            <p className="mt-1">中文经典游戏百科站 · 攻略 Wiki / 模拟器资料 / 游戏数据库</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-white">关于我们</Link>
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">隐私政策</Link>
            <Link href="/sitemap.xml" className="hover:text-gray-900 dark:hover:text-white">网站地图</Link>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-400 dark:border-gray-800">
          © {year} Retro Game Wiki · 仅供学习交流使用
        </div>
      </div>
    </footer>
  );
}
