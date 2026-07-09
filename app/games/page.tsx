import type { Metadata } from 'next';
import { GameCard } from '@/components/GameCard';
import { PlatformFilter } from '@/components/PlatformFilter';
import { Pagination } from '@/components/Pagination';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getPublishedGames } from '@/lib/queries/games';
import { getPlatforms } from '@/lib/queries/platforms';

export const metadata: Metadata = {
  title: '游戏库',
  description: '浏览所有经典游戏 - FC/SFC/GBA/PS1 等平台游戏数据库',
};

const PAGE_SIZE = 24;

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; page?: string }>;
}) {
  const params = await searchParams;
  const platformSlug = params.platform;
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const [gamesResult, platformsResult] = await Promise.all([
    getPublishedGames({ platformSlug, page, pageSize: PAGE_SIZE }),
    getPlatforms(),
  ]);

  const platforms = platformsResult.success ? platformsResult.data : [];
  const games = gamesResult.success ? gamesResult.data.items : [];
  const total = gamesResult.success ? gamesResult.data.total : 0;

  // 找当前选中平台名
  const activePlatform = platformSlug
    ? platforms.find((p) => p.slug === platformSlug)
    : undefined;

  // 构建分页 basePath
  const paginationBase = platformSlug ? `/games?platform=${platformSlug}` : '/games';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb items={[{ name: '首页', href: '/' }, { name: '游戏库', href: '/games' }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activePlatform ? `${activePlatform.name} 游戏` : '游戏库'}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          共 {total} 款游戏
        </p>
      </div>

      {/* 平台筛选 */}
      <PlatformFilter platforms={platforms} activeSlug={platformSlug} />

      {/* 游戏网格 */}
      {games.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl">🎮</p>
          <p className="mt-2">暂无游戏数据</p>
        </div>
      )}

      {/* 分页 */}
      <div className="mt-8">
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath={paginationBase} />
      </div>
    </div>
  );
}
