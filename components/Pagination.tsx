import Link from 'next/link';

/**
 * 分页组件
 * 简单的上一页/下一页 + 页码
 */

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string; // 如 /games 或 /games?platform=fc
}

export function Pagination({ page, pageSize, total, basePath }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // 构建分页链接
  const buildUrl = (p: number) => {
    const separator = basePath.includes('?') ? '&' : '?';
    return p === 1 ? basePath : `${basePath}${separator}page=${p}`;
  };

  // 显示页码范围（最多 7 个）
  const start = Math.max(1, page - 3);
  const end = Math.min(totalPages, start + 6);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="分页">
      {page > 1 && (
        <Link
          href={buildUrl(page - 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          上一页
        </Link>
      )}
      {start > 1 && (
        <>
          <Link href={buildUrl(1)} className="rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">1</Link>
          {start > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildUrl(p)}
          className={`rounded-md px-3 py-1.5 text-sm ${
            p === page
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
          }`}
        >
          {p}
        </Link>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-400">…</span>}
          <Link href={buildUrl(totalPages)} className="rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">{totalPages}</Link>
        </>
      )}
      {page < totalPages && (
        <Link
          href={buildUrl(page + 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          下一页
        </Link>
      )}
    </nav>
  );
}
