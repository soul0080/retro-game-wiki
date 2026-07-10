'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  endpoint: string;
  label?: string;
}

/** 删除按钮（带二次确认） */
export function DeleteButton({ endpoint, label = '删除' }: DeleteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('确定删除？此操作不可恢复。')) return;
    setDeleting(true);
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || '删除失败');
      }
    } catch {
      alert('网络错误');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="ml-3 text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
    >
      {deleting ? '删除中…' : label}
    </button>
  );
}
