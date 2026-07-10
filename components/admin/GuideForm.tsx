'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Guide, Game, ContentStatus, GuideType } from '@/types/database';

interface GuideFormProps {
  guide?: Guide;
  games: Game[];
}

const STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'review', label: '审核中' },
  { value: 'published', label: '已发布' },
  { value: 'archived', label: '已归档' },
];

const GUIDE_TYPES = [
  { value: 'main_story', label: '主线攻略' },
  { value: 'boss', label: 'Boss 战' },
  { value: 'sidequest', label: '支线任务' },
  { value: 'item', label: '道具收集' },
  { value: 'secret', label: '秘籍隐藏' },
  { value: 'character', label: '角色解析' },
  { value: 'ending', label: '结局达成' },
];

export function GuideForm({ guide, games }: GuideFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: guide?.title || '',
    slug: guide?.slug || '',
    game_id: guide?.game_id || '',
    guide_type: guide?.guide_type || 'main_story',
    summary: guide?.summary || '',
    content: guide?.content || '',
    difficulty: guide?.difficulty || '',
    status: guide?.status || 'draft',
    is_featured: guide?.is_featured ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = guide ? `/api/admin/guides/${guide.id}` : '/api/admin/guides';
      const method = guide ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/guides');
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
            placeholder="如 super-mario-walkthrough"
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
          <label className={labelCls}>攻略类型</label>
          <select
            className={inputCls}
            value={form.guide_type}
            onChange={(e) => setForm({ ...form, guide_type: e.target.value as GuideType })}
          >
            {GUIDE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
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

      <div>
        <label className={labelCls}>难度</label>
        <input
          className={inputCls}
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          placeholder="简单/中等/困难"
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
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            精选推荐（首页展示）
          </label>
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
