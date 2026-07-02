'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  heroImageUrl?: string | null;
  readingTimeMinutes: number;
  publishedAt?: Date | string | null;
  aiSummary?: string | null;
  category: { name: string; slug: string; color?: string | null };
  author: { name: string; image?: string | null };
}

interface HeroSectionProps {
  featuredArticle: Article | null;
  topStories: Article[];
}

export default function HeroSection({ featuredArticle, topStories }: HeroSectionProps) {
  if (!featuredArticle && topStories.length === 0) {
    return (
      <div className="bg-mesh rounded-2xl p-20 text-center border border-black/[0.04]">
        <div className="accent-line mx-auto mb-6" />
        <p className="headline-section text-xl text-ink-5">No articles published yet</p>
        <p className="body-text text-sm text-ink-5 mt-2">Check back soon for the latest news from Islamabad</p>
      </div>
    );
  }

  const hero = featuredArticle || topStories[0];
  const remaining = featuredArticle ? topStories : topStories.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Featured — 7 columns */}
      <div className="lg:col-span-7">
        <Link href={`/${hero.category?.slug || 'pakistan'}/${hero.slug}`} className="group block">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden hover-zoom shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {hero.heroImageUrl ? (
              <Image
                src={hero.heroImageUrl}
                alt={hero.title}
                fill
                priority
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pearl to-mist flex items-center justify-center">
                <span className="headline-section text-2xl text-ink-6">Khabar Islamabad</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />

            {/* Top badges */}
            <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
              <span className="badge-category shadow-lg">{hero.category?.name || 'News'}</span>
              {hero.aiSummary && (
                <span className="badge-ai shadow-lg">
                  <Sparkles size={9} /> AI
                </span>
              )}
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-9 z-10">
              <h1 className="headline-hero text-[26px] md:text-[30px] lg:text-[34px] text-white mb-3 max-w-2xl leading-[1.08] group-hover:text-white/90 transition-colors duration-300">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="text-white/70 text-[14px] md:text-[15px] line-clamp-2 mb-5 max-w-xl leading-relaxed font-light">
                  {hero.subtitle}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-white/50 font-medium">
                <span className="text-white/80 font-semibold">{hero.author?.name}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                {hero.publishedAt && (
                  <>
                    <span>{formatDistanceToNow(new Date(hero.publishedAt), { addSuffix: true })}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {hero.readingTimeMinutes} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Top stories — 5 columns */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="section-header !mb-4 !pb-3">
          <div className="section-label">
            <span className="caption text-brand-red font-extrabold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-red)' }} />
              Top Stories
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col divide-y divide-black/[0.04] border border-black/[0.04] rounded-2xl overflow-hidden bg-white">
          {remaining.length > 0 ? (
            remaining.map((story, index) => (
              <Link
                key={story.id}
                href={`/${story.category?.slug || 'pakistan'}/${story.slug}`}
                className="group flex gap-4 px-5 py-4 hover:bg-pearl/40 transition-all duration-200 flex-1 spotlight"
              >
                <span className="headline-hero text-[28px] text-ink-6/30 leading-none select-none flex-shrink-0 w-8 pt-0.5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                  <h3 className="headline-card text-[14px] md:text-[15px] text-ink group-hover:text-brand-red transition-colors duration-200 line-clamp-2">
                    {story.title}
                  </h3>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    <span className="badge-category !text-[8px] !px-1.5 !py-0.5 !shadow-none">{story.category?.name}</span>
                    {story.publishedAt && (
                      <span className="text-[10px] text-ink-5 font-medium">
                        {formatDistanceToNow(new Date(story.publishedAt), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-ink-5 text-sm flex-1 flex items-center justify-center">
              No stories available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
