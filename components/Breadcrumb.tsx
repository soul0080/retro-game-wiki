import Link from 'next/link';
import { Fragment } from 'react';

/**
 * 面包屑导航
 * 用于游戏详情、攻略详情等页面，同时输出 BreadcrumbList Schema
 */

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <nav aria-label="面包屑" className="text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <Fragment key={item.href}>
                <li>
                  {isLast ? (
                    <span className="text-gray-900 dark:text-gray-100" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-gray-900 dark:hover:text-gray-100">
                      {item.name}
                    </Link>
                  )}
                </li>
                {!isLast && <li className="text-gray-300 dark:text-gray-600">/</li>}
              </Fragment>
            );
          })}
        </ol>
      </nav>
      {/* BreadcrumbList Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.href,
            })),
          }),
        }}
      />
    </>
  );
}
