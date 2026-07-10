'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Boss, Game } from '@/types/database';

interface BossFormProps {
  boss?: Boss;
  games: Game[];
}

export function BossForm({ boss, games }: BossFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: boss?.name || '',
    game_id: boss?.game_id || '',
    description: boss?.description || '',
    hp: boss?.hp?.toString() || '',
    weakness: boss?.weakness || '',
    strategy: boss?.strategy || '',
    drops: boss?.drops?.join(', ') || '',
    image_url: boss?.image_url || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // drops 前端逗号分隔，提交时转数组；hp 转 number
    const payload = {
      name: form.name,
      game_id: form.game_id,
      description: form.description || null,
      hp: form.hp ? parseInt(form.hp, 10) : null,
      weakness: form.weakness || null,
      strategy: form.strategy || null,
      drops: form.drops
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
    };

    try {
      const url = boss ? `/api/admin/bosses/${boss.id}` : '/api/admin/bosses';
      const method = boss ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/bosses');
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
          <label className={labelCls}>名称 *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <label className={labelCls}>HP</label>
          <input
            type="number"
            className={inputCls}
            value={form.hp}
            onChange={(e) => setForm({ ...form, hp: e.target.value })}
            placeholder="如 9999"
          />
        </div>
        <div>
          <label className={labelCls}>弱点</label>
          <input
            className={inputCls}
            value={form.weakness}
            onChange={(e) => setForm({ ...form, weakness: e.target.value })}
            placeholder="如 冰属性 / 圣水"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>简介</label>
        <textarea
          rows={3}
          className={inputCls}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>攻略</label>
        <textarea
          rows={5}
          className={inputCls}
          value={form.strategy}
          onChange={(e) => setForm({ ...form, strategy: e.target.value })}
          placeholder="Boss 战打法说明"
        />
      </div>

      <div>
        <label className={labelCls}>掉落物（逗号分隔）</label>
        <input
          className={inputCls}
          value={form.drops}
          onChange={(e) => setForm({ ...form, drops: e.target.value })}
          placeholder="如 圣剑, 龙鳞, 1000 金币"
        />
        <p className="mt-1 text-xs text-gray-400">多个掉落物用英文逗号分隔</p>
      </div>

      <div>
        <label className={labelCls}>图片 URL</label>
        <input
          className={inputCls}
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="https://…"
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
