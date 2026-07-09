/**
 * 首页（占位版）
 * Phase 3 将接入数据库动态内容：热门游戏、平台入口、热门攻略
 */

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Retro Game Wiki
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          中文经典游戏百科站 · 攻略 Wiki / 模拟器资料 / 游戏数据库
        </p>
        <p className="mt-2 text-sm text-gray-400">
          覆盖 FC / SFC / GBA / PS1 / PSP / NDS 等经典平台
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-md rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          网站建设中
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Phase 2 基础架构已完成，内容开发进行中
        </p>
      </section>
    </div>
  );
}
