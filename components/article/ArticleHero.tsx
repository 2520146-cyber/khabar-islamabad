'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Clock, Share2, Bookmark, Printer, ExternalLink, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import TranslateButton from './TranslateButton';

interface ArticleHeroProps {
  article: any;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const handleBookmark = async () => {
    try {
      const method = bookmarked ? 'DELETE' : 'POST';
      await fetch('/api/bookmarks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      });
      setBookmarked(!bookmarked);
    } catch {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="mb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] text-ink-5 mb-6 font-medium">
        <Link href="/" className="hover:text-brand-red transition-colors uppercase tracking-[0.08em]">Home</Link>
        <span className="text-ink-6">/</span>
        <Link href={`/${article.category?.slug || 'pakistan'}`} className="hover:text-brand-red transition-colors uppercase tracking-[0.08em]">
          {article.category?.name}
        </Link>
        <span className="text-ink-6">/</span>
        <span className="text-ink-5 truncate max-w-[200px]">{article.title}</span>
      </nav>

      {/* Category badge */}
      <span className="badge-category mb-5 inline-block">{article.category?.name}</span>

      {/* Title */}
      <h1 className="headline-hero text-[28px] md:text-[36px] lg:text-[42px] text-ink leading-[1.06] mb-5 max-w-3xl">
        {article.title}
      </h1>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-[18px] text-ink-4 mb-8 max-w-2xl leading-relaxed font-light">
          {article.subtitle}
        </p>
      )}

      {/* Byline */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-black/[0.05]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg" style={{ background: 'var(--gradient-red)' }}>
            {article.author?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'A'}
          </div>
          <div>
            <Link href={`/reporter/${article.author?.id}`} className="text-[14px] font-bold text-ink hover:text-brand-red transition-colors duration-200">
              {article.author?.name}
            </Link>
            <p className="text-[11px] text-ink-5 mt-0.5 font-medium">
              {article.author?.bio || 'Senior Reporter'} · Islamabad
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 ml-auto text-[12px] text-ink-5 font-medium">
          {article.publishedAt && (
            <>
              <span>{format(new Date(article.publishedAt), 'd MMMM yyyy')}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-ink-6" />
            </>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-ink-6" /> {article.readingTimeMinutes} min read
          </span>
        </div>
      </div>

      {/* Tool buttons */}
      <div className="flex items-center gap-2 mb-10 flex-wrap">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-[12px] px-3.5 py-2"
        >
          <ExternalLink size={13} /> Share on X
        </a>
        <a
          href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-[12px] px-3.5 py-2"
        >
          <Share2 size={13} /> WhatsApp
        </a>
        <button onClick={handleCopyLink} className="btn-ghost text-[12px] px-3.5 py-2">
          {copied ? <Check size={13} className="text-green-600" /> : <LinkIcon size={13} />}
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <button
          onClick={handleBookmark}
          className={`btn-ghost text-[12px] px-3.5 py-2 ${bookmarked ? '!bg-brand-red/8 !text-brand-red !border-brand-red/15' : ''}`}
        >
          <Bookmark size={13} fill={bookmarked ? 'currentColor' : 'none'} />
          {bookmarked ? 'Saved' : 'Save'}
        </button>
        <button onClick={() => window.print()} className="btn-ghost text-[12px] px-3.5 py-2 no-print">
          <Printer size={13} /> Print
        </button>
        <TranslateButton
          articleId={article.id}
          currentLanguage={currentLang}
          onLanguageChange={(lang) => setCurrentLang(lang)}
        />
      </div>

      {/* Hero image */}
      {article.heroImageUrl && (
        <figure className="mb-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
            <Image
              src={article.heroImageUrl}
              alt={article.heroImageAlt || article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
          {article.heroImageCaption && (
            <figcaption className="text-[12px] text-ink-5 mt-4 italic pl-1 flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-ink-6 rounded-full" />
              {article.heroImageCaption}
            </figcaption>
          )}
        </figure>
      )}
    </div>
  );
}
