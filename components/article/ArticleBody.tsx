'use client';

interface ArticleBodyProps {
  article: any;
  currentLanguage?: string;
}

export default function ArticleBody({ article, currentLanguage = 'en' }: ArticleBodyProps) {
  let content = article.contentHtml || '';
  let dir: 'ltr' | 'rtl' = 'ltr';
  let fontFamily = 'inherit';

  switch (currentLanguage) {
    case 'ur':
      content = article.contentUr || '';
      dir = 'rtl';
      fontFamily = "'Noto Nastaliq Urdu', serif";
      break;
    case 'es':
      content = article.contentEs || '';
      break;
    case 'ar':
      content = article.contentAr || '';
      dir = 'rtl';
      fontFamily = "'Noto Nastaliq Urdu', serif";
      break;
    default:
      content = article.contentHtml || '';
  }

  if (currentLanguage !== 'en' && !content) {
    return (
      <div className="py-16 text-center">
        <div className="glass-card inline-flex items-center gap-3 px-6 py-4">
          <svg className="animate-spin h-4 w-4 text-brand-red" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-[13px] text-ink-4 font-medium">Translation in progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      style={{ fontFamily }}
      className="prose-article drop-cap"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
