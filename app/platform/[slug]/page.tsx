import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { GameCard } from '@/components/GameCard';
import { getPlatformBySlug } from '@/lib/queries/platforms';
import { getGamesByPlatformSlug } from '@/lib/queries/games';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPlatformBySlug(slug);
  if (!result.success) return { title: '平台不存在' };
  return {
    title: `${result.data.name} 游戏`,
    description: `${result.data.name} 平台游戏库 - ${result.data.description || ''}`,
  };
}

export default async function PlatformPage({ params }: PageProps) {
  const { slug } = await params;
  const [platformResult, gamesResult] = await Promise.all([
    getPlatformBySlug(slug),
    getGamesByPlatformSlug(slug),
  ]);

  if (!platformResult.success) notFound();
  const platform = platformResult.data;
  const games = gamesResult.success ? gamesResult.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { name: '首页', href: '/' },
          { name: '游戏库', href: '/games' },
          { name: platform.name, href: `/platform/${platform.slug}` },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{platform.name}</h1>
        {platform.manufacturer && (
          <p className="mt-1 text-sm text-gray-500">{platform.manufacturer} · {platform.release_year}</p>
        )}
        {platform.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{platform.description}</p>
        )}
      </div>

      {games.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-gray-400">
          <p className="text-4xl">🎮</p>
          <p className="mt-2">该平台暂无游戏</p>
        </div>
      )}
    </div>
  );
}
