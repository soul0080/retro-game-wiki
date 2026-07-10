import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

const NAV_ITEMS = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/games', label: '游戏管理', icon: '🎮' },
  { href: '/admin/guides', label: '攻略管理', icon: '📖' },
  { href: '/admin/characters', label: '角色管理', icon: '🧙' },
  { href: '/admin/bosses', label: 'Boss 管理', icon: '👹' },
  { href: '/admin/items', label: '道具管理', icon: '🗡️' },
  { href: '/admin/cheats', label: '秘籍管理', icon: '🎮' },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-56 flex-col bg-gray-900 text-gray-100">
      <div className="border-b border-gray-800 px-4 py-5">
        <Link href="/admin" className="text-lg font-bold">
          Retro Wiki
        </Link>
        <p className="text-xs text-gray-400">管理后台</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-2 block rounded-md px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          🌐 查看前台
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
