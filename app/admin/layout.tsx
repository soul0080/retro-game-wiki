/**
 * Admin 根布局（最小包装）
 * 不渲染前台 SiteHeader/SiteFooter，但根 layout 的 <html><body> 仍包裹此处
 * 侧边栏由 (dashboard)/layout.tsx 提供，login 页不受侧边栏影响
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">{children}</div>;
}
