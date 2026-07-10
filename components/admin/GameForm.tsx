'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Game, Platform, Genre, ContentStatus } from '@/types/database';

interface GameFormProps {
  game?: Game;
  platforms: Platform[];
  genres: Genre[];
  selectedPlatformIds?: string[];
  selectedGenreIds?: string[];
}

const STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'review', label: '审核中' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
];

export function GameForm({
  game,
  platforms,
  genres,
  selectedPlatformIds = [],
  selectedGenreIds = [],
}: GameFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name_cn: game?.name_cn || '',
    name_en: game?.name_en || '',
    name_jp: game?.name_jp || '',
    slug: game?.slug || '',
    release_year: game?.release_year?.toString() || '',
    developer: game?.developer || '',
    publisher: game?.publisher || '',
    region: game?.region || '',
    description: game?.description || '',
    story_summary: game?.story_summary || '',
    cover_url: game?.cover_url || '',
    banner_url: game?.banner_url || '',
    status: game?.status || 'draft',
  });
  const [platformIds, setPlatformIds] = useState<string[]>(selectedPlatformIds);
  const [genreIds, setGenreIds] = useState<string[]>(selectedGenreIds);

  function togglePlatform(id: string) {
    setPlatformIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }
  function toggleGenre(id: string) {
    setGenreIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...form,
      release_year: form.release_year ? parseInt(form.release_year, 10) : null,
      platforms: platformIds,
      genres: genreIds,
    };

    try {
      const url = game ? `/api/admin/games/${game.id}` : '/api/admin/games';
      const method = game ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/games');
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
          <label className={labelCls}>中文名 *</label>
          <input
            className={inputCls}
            value={form.name_cn}
            onChange={(e) => setForm({ ...form, name_cn: e.target.value })}
            required
          />
        </div>
        <div>
          <label className={labelCls}>Slug *</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="如 super-mario-bros"
            required
          />
        </div>
        <div>
          <label className={labelCls}>英文名</label>
          <input className={inputCls} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>日文名</label>
          <input className={inputCls} value={form.name_jp} onChange={(e) => setForm({ ...form, name_jp: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>发行年份</label>
          <input
            type="number"
            className={inputCls}
            value={form.release_year}
            onChange={(e) => setForm({ ...form, release_year: e.target.value })}
          />
        </div>
        <div>
          <label className={labelCls}>地区</label>
          <input className={inputCls} value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="日本/美国/欧洲" />
        </div>
        <div>
          <label className={labelCls}>开发商</label>
          <input className={inputCls} value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>发行商</label>
          <input className={inputCls} value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
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
        <label className={labelCls}>剧情概要</label>
        <textarea
          rows={3}
          className={inputCls}
          value={form.story_summary}
          onChange={(e) => setForm({ ...form, story_summary: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>封面 URL</label>
          <input className={inputCls} value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://…" />
        </div>
        <div>
          <label className={labelCls}>横幅 URL</label>
          <input className={inputCls} value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} placeholder="https://…" />
        </div>
      </div>

      {/* 平台多选 */}
      <div>
        <label className={labelCls}>平台</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                platformIds.includes(p.id)
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 类型多选 */}
      <div>
        <label className={labelCls}>类型</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              type="button"
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                genreIds.includes(g.id)
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>状态</label>
          <select
            className={inputCls}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ContentStatus })}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
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
