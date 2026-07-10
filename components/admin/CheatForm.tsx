'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Cheat, Game, Platform } from '@/types/database';

interface CheatFormProps {
  cheat?: Cheat;
  games: Game[];
  platforms: Platform[];
}

export function CheatForm({ cheat, games, platforms }: CheatFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: cheat?.title || '',
    game_id: cheat?.game_id || '',
    platform_id: cheat?.platform_id || '',
    code: cheat?.code || '',
    description: cheat?.description || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: form.title,
      game_id: form.game_id,
      platform_id: form.platform_id || null,
      code: form.code || null,
      description: form.description || null,
    };

    try {
      const url = cheat ? `/api/admin/cheats/${cheat.id}` : '/api/admin/cheats';
      const method = cheat ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/cheats');
        router.refresh();
      } else {
        setError(data.error || '保存失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white';
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>标题 *</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className={labelCls}>所属游戏 *</label>
          <select
            className={inputCls}
            value={form.game_id}
            onChange={(e) => setForm({ ...form, game_id: e.target.value })}
            required
          >
            <option value="">请选择游戏</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name_cn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>平台</label>
          <select
            className={inputCls}
            value={form.platform_id}
            onChange={(e) => setForm({ ...form, platform_id: e.target.value })}
          >
            <option value="">全平台</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>秘籍代码</label>
          <input
            className={inputCls}
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="如 上上下下左右左右BA"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>效果说明</label>
        <textarea
          rows={3}
          className={inputCls}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-gray-900"
        >
          {loading ? '保存中…' : '保存'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        >
          取消
        </button>
      </div>
    </form>
  );
}
