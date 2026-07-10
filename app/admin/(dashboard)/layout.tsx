import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-x-auto">
        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </div>
    </div>
  );
}
