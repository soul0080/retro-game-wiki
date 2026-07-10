'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EmulatorGuide, Platform } from '@/types/database';

interface EmulatorGuideFormProps {
  emulatorGuide?: EmulatorGuide;
  platforms: Platform[];
}

export function EmulatorGuideForm({ emulatorGuide, platforms }: EmulatorGuideFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: emulatorGuide?.title || '',
    slug: emulatorGuide?.slug || '',
    platform_id: emulatorGuide?.platform_id || '',
    software: emulatorGuide?.software || '',
    content: emulatorGuide?.content || '',
    recommended_setting: emulatorGuide?.recommended_setting
      ? JSON.stringify(emulatorGuide.recommended_setting, null, 2)
      : '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 解析推荐设置 JSON
      let recommendedSetting: Record<string, unknown> | null = null;
      const settingStr = form.recommended_setting.trim();
      if (settingStr) {
        try {
          recommendedSetting = JSON.parse(settingStr);
        } catch {
          // 解析失败则提交 null
          recommendedSetting = null;
        }
      }

      const url = emulatorGuide
        ? `/api/admin/emulator-guides/${emulatorGuide.id}`
        : '/api/admin/emulator-guides';
      const method = emulatorGuide ? 'PUT' : 'POST';
      const payload = {
        title: form.title,
        slug: form.slug,
        platform_id: form.platform_id,
        software: form.software,
        content: form.content,
        recommended_setting: recommendedSetting,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/emulator-guides');
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
            placeholder="如 nes-emulator-guide"
            required
          />
        </div>
        <div>
          <label className={labelCls}>所属平台 *</label>
          <select
            className={inputCls}
            value={form.platform_id}
            onChange={(e) => setForm({ ...form, platform_id: e.target.value })}
            required
          >
            <option value="">请选择平台</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>模拟器软件</label>
          <input
            className={inputCls}
            value={form.software}
            onChange={(e) => setForm({ ...form, software: e.target.value })}
            placeholder="如 FCEUX / Snes9x / mGBA"
          />
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div>
        <label className={labelCls}>正文（Markdown）</label>
        <textarea
          rows={20}
          className={`${inputCls} font-mono text-sm`}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder={'## 安装步骤\n\n1. 下载模拟器\n2. 配置 ROM 路径\n\n## 推荐配置\n\n- 分辨率：256x240\n- 音频：44100Hz'}
        />
        <p className="mt-1 text-xs text-gray-400">
          支持 GFM 语法：标题、列表、表格、代码块、引用、粗体、斜体等
        </p>
      </div>

      {/* 推荐设置 JSON */}
      <div>
        <label className={labelCls}>推荐设置（JSON）</label>
        <textarea
          rows={8}
          className={`${inputCls} font-mono text-sm`}
          value={form.recommended_setting}
          onChange={(e) => setForm({ ...form, recommended_setting: e.target.value })}
          placeholder={'{"resolution":"256x240","audio":"44100Hz"}'}
        />
        <p className="mt-1 text-xs text-gray-400">
          以 JSON 格式输入推荐配置；为空或解析失败时将提交 null
        </p>
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
