'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { News, Game, ContentStatus } from '@/types/database';

interface NewsFormProps {
  news?: News;
  games: Game[];
}

const STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'review', label: '审核中' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
];

/** 将 ISO 字符串转换为 datetime-local input 所需格式 YYYY-MM-DDTHH:mm */
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  // 截取前 16 位：YYYY-MM-DDTHH:mm
  return iso.slice(0, 16);
}

export function NewsForm({ news, games }: NewsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: news?.title || '',
    slug: news?.slug || '',
    source: news?.source || '',
    source_url: news?.source_url || '',
    summary: news?.summary || '',
    content: news?.content || '',
    cover_url: news?.cover_url || '',
    related_game_id: news?.related_game_id || '',
    status: news?.status || 'draft',
    published_at: toDatetimeLocal(news?.published_at || null),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = news ? `/api/admin/news/${news.id}` : '/api/admin/news';
      const method = news ? 'PUT' : 'POST';
      const payload = {
        ...form,
        related_game_id: form.related_game_id === '' ? null : form.related_game_id,
        published_at: form.published_at === '' ? null : form.published_at,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/news');
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
          <label className={labelCls}>Slug *</label>
          <input
            className={inputCls}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="如 retro-game-news-2026"
            required
          />
        </div>
        <div>
          <label className={labelCls}>来源</label>
          <input
            className={inputCls}
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="来源名称"
          />
        </div>
        <div>
          <label className={labelCls}>来源链接</label>
          <input
            className={inputCls}
            value={form.source_url}
            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>摘要</label>
        <textarea
          rows={2}
          className={inputCls}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
      </div>

      {/* Markdown 编辑器 */}
      <div>
        <label className={labelCls}>正文（Markdown）</label>
        <textarea
          rows={20}
          className={`${inputCls} font-mono text-sm`}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder={'## 二级标题\n\n正文内容…\n\n### 三级标题\n\n- 列表项\n- 列表项'}
        />
        <p className="mt-1 text-xs text-gray-400">
          支持 GFM 语法：标题、列表、表格、代码块、引用、粗体、斜体等
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>封面图 URL</label>
          <input
            className={inputCls}
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className={labelCls}>关联游戏</label>
          <select
            className={inputCls}
            value={form.related_game_id}
            onChange={(e) => setForm({ ...form, related_game_id: e.target.value })}
          >
            <option value="">无关联游戏</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name_cn}</option>
            ))}
          </select>
        </div>
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
        <div>
          <label className={labelCls}>发布时间</label>
          <input
            type="datetime-local"
            className={inputCls}
            value={form.published_at}
            onChange={(e) => setForm({ ...form, published_at: e.target.value })}
          />
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
