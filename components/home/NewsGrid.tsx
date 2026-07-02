'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Article {
  id: string;
  title: string;
  slug: string;
  heroImageUrl?: string | null;
  readingTimeMinutes: number;
  publishedAt?: Date | string | null;
  category: { name: string; slug: string; color?: string | null };
  author: { name: string };
}

interface NewsGridProps {
  articles: Article[];
  columns?: 2 | 3 | 4;
}

export default function NewsGrid({ articles, columns = 3 }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-5 text-sm">No articles available in this section yet.</p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-5 lg:gap-6`}>
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/${article.category?.slug || 'pakistan'}/${article.slug}`}
          className="group surface-card overflow-hidden spotlight"
        >
          {/* Thumbnail */}
          <div className="relative h-[160px] overflow-hidden">
            {article.heroImageUrl ? (
              <Image
                src={article.heroImageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pearl to-mist flex items-center justify-center">
                <span className="font-serif text-ink-6 text-sm">Khabar</span>
              </div>
            )}
            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="badge-category !shadow-md">{article.category?.name}</span>
            </div>
            {/* Bottom gradient on image */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5 relative z-10">
            <h3 className="headline-card text-[15px] text-ink group-hover:text-brand-red transition-colors duration-200 line-clamp-2 mb-3">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-ink-5">
              <span className="font-semibold text-ink-4">{article.author?.name}</span>
              <span className="w-1 h-1 rounded-full bg-ink-6" />
              {article.publishedAt && (
                <>
                  <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                  <span className="w-1 h-1 rounded-full bg-ink-6" />
                </>
              )}
              <span className="flex items-center gap-0.5">
                <Clock size={10} /> {article.readingTimeMinutes} min
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
