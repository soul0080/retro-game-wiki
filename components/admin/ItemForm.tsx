'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Item, Game, ItemType } from '@/types/database';

interface ItemFormProps {
  item?: Item;
  games: Game[];
}

export function ItemForm({ item, games }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: item?.name || '',
    game_id: item?.game_id || '',
    type: item?.type || ('item' as ItemType),
    description: item?.description || '',
    effect: item?.effect || '',
    location: item?.location || '',
    rarity: item?.rarity || '',
    image_url: item?.image_url || '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: form.name,
      game_id: form.game_id,
      type: form.type as ItemType,
      description: form.description || null,
      effect: form.effect || null,
      location: form.location || null,
      rarity: form.rarity || null,
      image_url: form.image_url || null,
    };

    try {
      const url = item ? `/api/admin/items/${item.id}` : '/api/admin/items';
      const method = item ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/items');
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
          <label className={labelCls}>类型 *</label>
          <select
            className={inputCls}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ItemType })}
            required
          >
            <option value="weapon">武器</option>
            <option value="armor">防具</option>
            <option value="magic">魔法</option>
            <option value="item">道具</option>
            <option value="accessory">配饰</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>稀有度</label>
          <input
            className={inputCls}
            value={form.rarity}
            onChange={(e) => setForm({ ...form, rarity: e.target.value })}
            placeholder="如 普通/稀有/传说"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>效果说明</label>
          <input
            className={inputCls}
            value={form.effect}
            onChange={(e) => setForm({ ...form, effect: e.target.value })}
            placeholder="如 攻击力 +10"
          />
        </div>
        <div>
          <label className={labelCls}>获取位置</label>
          <input
            className={inputCls}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="如 宝箱 / 商店购买"
          />
        </div>
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
