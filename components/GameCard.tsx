import Link from 'next/link';
import type { Game } from '@/types/database';
import { PlatformBadge } from './PlatformBadge';

/**
 * 游戏卡片
 * 用于游戏库列表、首页热门游戏
 */

interface GameCardProps {
  game: Game & {
    platforms?: { id: string; name: string; slug: string }[];
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      {/* 封面 */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {game.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.cover_url}
            alt={game.name_cn}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300 dark:text-gray-700">
            🎮
          </div>
        )}
      </div>

      {/* 信息 */}
      <div className="p-3">
        <h3 className="truncate font-medium text-gray-900 dark:text-white">
          {game.name_cn}
        </h3>
        {game.name_en && (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{game.name_en}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          {game.release_year && (
            <span className="text-xs text-gray-400">{game.release_year}</span>
          )}
          {game.platforms?.map((p) => (
            <PlatformBadge key={p.id} platform={p} />
          ))}
        </div>
      </div>
    </Link>
  );
}
