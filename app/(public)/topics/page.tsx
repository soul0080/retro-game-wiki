import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '专题 - Retro Game Wiki',
  description: '经典游戏专题合集',
};

export default async function TopicsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">专题</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        经典游戏专题合集，深度回顾游戏历史与文化
      </p>

      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        📢 内容建设中，敬请期待
      </div>
    </div>
  );
}
