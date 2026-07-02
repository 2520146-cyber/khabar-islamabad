'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Send,
  Globe,
  Loader2,
  CheckCircle,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import BlockEditor from '@/components/cms/BlockEditor';

interface EditorClientProps {
  article: any;
  categories: any[];
  userId: string;
  userRole: string;
}

export default function EditorClient({ article, categories, userId, userRole }: EditorClientProps) {
  const router = useRouter();

  const [title, setTitle] = useState(article?.title || '');
  const [subtitle, setSubtitle] = useState(article?.subtitle || '');
  const [content, setContent] = useState<any[]>(article?.contentJson?.blocks || []);
  const [contentHtml, setContentHtml] = useState(article?.contentHtml || '');
  const [categoryId, setCategoryId] = useState(article?.categoryId || categories[0]?.id || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [status, setStatus] = useState(article?.status || 'DRAFT');
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured || false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [articleId, setArticleId] = useState(article?.id || null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!article && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, article]);

  // Auto-save (debounced 30s)
  useEffect(() => {
    if (!title && content.length === 0) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [title, subtitle, content, categoryId, slug]);

  const handleSave = async (autoSave = false) => {
    if (!autoSave) setSaving(true);

    try {
      const body = {
        title,
        subtitle,
        contentJson: { blocks: content },
        contentHtml,
        categoryId,
        slug,
        status,
        isBreaking,
        isFeatured,
        readingTimeMinutes: Math.max(1, Math.ceil(contentHtml.split(/\s+/).length / 200)),
      };

      if (articleId) {
        const res = await fetch(`/api/articles/${articleId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setLastSaved(new Date().toLocaleTimeString());
        }
      } else {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          const newArticle = await res.json();
          setArticleId(newArticle.id);
          setLastSaved(new Date().toLocaleTimeString());
          router.replace(`/cms/editor?id=${newArticle.id}`, { scroll: false });
        }
      }
    } catch {}
    if (!autoSave) setSaving(false);
  };

  const handlePublish = async () => {
    if (!articleId) return;
    setSaving(true);
    try {
      await handleSave();
      const res = await fetch(`/api/articles/${articleId}/publish`, {
        method: 'POST',
      });
      if (res.ok) {
        setStatus('PUBLISHED');
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch {}
    setSaving(false);
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-700',
    REVIEW: 'bg-orange-100 text-orange-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    SCHEDULED: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[status] || ''}`}>
            {status}
          </span>
          {lastSaved && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle size={12} /> Saved {lastSaved}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-surface-1 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
          <button
            onClick={() => {
              setStatus('REVIEW');
              handleSave();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-surface-1 transition-colors"
          >
            <Send size={14} /> Submit for Review
          </button>
          {['SUPER_ADMIN', 'EDITOR_IN_CHIEF', 'MANAGING_EDITOR', 'EDITOR'].includes(userRole) && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors"
            >
              <Globe size={14} /> Publish Now
            </button>
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Headline */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article headline…"
            className="w-full text-2xl md:text-3xl font-serif font-medium text-ink placeholder-gray-300 border-none outline-none mb-3 bg-transparent"
          />

          {/* Subtitle */}
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle…"
            className="w-full text-base text-gray-600 placeholder-gray-300 border-none outline-none mb-6 bg-transparent"
          />

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Category */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Slug */}
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug"
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm w-48"
            />

            {/* Breaking toggle */}
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="rounded border-gray-300"
              />
              Breaking
            </label>

            {/* Featured toggle */}
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              Featured
            </label>
          </div>

          {/* Hero image upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-6 hover:border-brand-red/50 transition-colors cursor-pointer">
            <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Click to upload hero image or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 10MB</p>
          </div>

          {/* Block editor */}
          <BlockEditor
            blocks={content}
            onChange={(blocks, html) => {
              setContent(blocks);
              setContentHtml(html);
            }}
          />
        </div>
      </div>

      {/* Right panel - AI */}
      <div className="w-64 border-l border-gray-100 bg-white p-4 overflow-y-auto hidden xl:block">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">AI Assist</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={async () => {
              if (!title && !contentHtml) return;
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'summary', content: contentHtml }),
              });
              const data = await res.json();
              if (data.summary) alert(`AI Summary:\n\n${data.summary}`);
            }}
            className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-surface-1 transition-colors"
          >
            ✨ Write AI summary
          </button>
          <button
            onClick={async () => {
              if (!title || !contentHtml) return;
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'headlines', title, content: contentHtml }),
              });
              const data = await res.json();
              if (data.headlines) {
                const selected = prompt(
                  'AI Generated Headlines:\n\n' +
                  data.headlines.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') +
                  '\n\nEnter number to use (1-5):'
                );
                if (selected && data.headlines[parseInt(selected) - 1]) {
                  setTitle(data.headlines[parseInt(selected) - 1]);
                }
              }
            }}
            className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-surface-1 transition-colors"
          >
            📝 Generate headlines
          </button>
          <button
            onClick={async () => {
              if (!title || !contentHtml) return;
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'seo', title, content: contentHtml }),
              });
              const data = await res.json();
              if (data.metaTitle) {
                alert(`SEO Meta:\nTitle: ${data.metaTitle}\nDescription: ${data.metaDescription}\nKeywords: ${data.keywords?.join(', ')}`);
              }
            }}
            className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-surface-1 transition-colors"
          >
            🔍 Generate SEO meta
          </button>
          <button
            onClick={async () => {
              if (!contentHtml) return;
              const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'faq', content: contentHtml }),
              });
              const data = await res.json();
              if (data.faqs) {
                alert('FAQ Generated:\n\n' + data.faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n'));
              }
            }}
            className="w-full text-left px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-surface-1 transition-colors"
          >
            ❓ Generate FAQ
          </button>
        </div>

        {/* Article settings */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Author: {userId ? 'You' : '—'}</p>
            <p>Category: {categories.find((c) => c.id === categoryId)?.name || '—'}</p>
            <p>Slug: /{slug || '—'}</p>
            <p>Words: {contentHtml.split(/\s+/).filter(Boolean).length}</p>
            <p>Reading time: {Math.max(1, Math.ceil(contentHtml.split(/\s+/).length / 200))} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
