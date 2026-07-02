'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Sparkles, Zap } from 'lucide-react';

interface TimelineStoryProps {
  article: any;
  isLast: boolean;
}

export default function TimelineStory({ article, isLast }: TimelineStoryProps) {
  const time = article.publishedAt
    ? format(new Date(article.publishedAt), 'h:mm a')
    : '';

  return (
    <Link
      href={`/${article.category?.slug || 'pakistan'}/${article.slug}`}
      className={`group flex items-start gap-4 px-4 py-3 hover:bg-surface-1 transition-colors ${
        !isLast ? 'border-b border-gray-50' : ''
      }`}
    >
      {/* Time */}
      <div className="flex-shrink-0 w-16 pt-1">
        <span className="font-mono text-xs text-gray-400">{time}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
          {article.category?.name}
        </span>

        {/* Headline */}
        <h3 className="text-sm font-serif font-medium text-ink group-hover:text-brand-red transition-colors leading-snug line-clamp-2 mt-0.5">
          {article.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{article.author?.name}</span>
          <span>·</span>
          <span>{article.readingTimeMinutes} min read</span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {article.isBreaking && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
              <Zap size={10} /> Breaking
            </span>
          )}
          {article.aiSummary && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">
              <Sparkles size={10} /> AI summary
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-[60px] h-[44px] rounded overflow-hidden border border-gray-100">
        {article.heroImageUrl ? (
          <Image
            src={article.heroImageUrl}
            alt=""
            width={60}
            height={44}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-surface-2 flex items-center justify-center">
            <span className="text-gray-300 text-xs">📷</span>
          </div>
        )}
      </div>
    </Link>
  );
}
