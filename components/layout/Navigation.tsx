'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, LogOut, Bookmark, LayoutDashboard } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Pakistan', href: '/pakistan' },
  { label: 'Politics', href: '/politics' },
  { label: 'Business', href: '/business' },
  { label: 'World', href: '/world' },
  { label: 'Tech', href: '/technology' },
  { label: 'Sports', href: '/sports' },
  { label: 'Opinion', href: '/opinion' },
];

const MORE_LINKS = [
  { label: 'Entertainment', href: '/entertainment' },
  { label: 'Health', href: '/health' },
  { label: 'Education', href: '/education' },
  { label: 'Videos', href: '/videos' },
  { label: 'Podcasts', href: '/podcasts' },
  { label: 'Photo Stories', href: '/photo-stories' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => { if (d?.user) setSession(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`)
        .then((r) => r.json())
        .then((d) => setSearchResults(d.hits || []))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-nav shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white/95 backdrop-blur-sm border-b border-black/[0.04]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[54px] flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-baseline flex-shrink-0 group">
              <span className="font-serif text-[23px] font-extrabold text-brand-red tracking-[-0.03em] group-hover:opacity-80 transition-opacity duration-300">kh</span>
              <span className="font-serif text-[23px] font-extrabold text-ink tracking-[-0.03em] group-hover:opacity-80 transition-opacity duration-300">abar</span>
              <span className="text-brand-gold text-[23px] font-extrabold leading-none ml-[1px]">.</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-[13px] font-semibold text-ink-4 hover:text-ink transition-colors duration-200 group"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute bottom-[2px] left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-brand-red to-red-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}

              <div className="relative ml-1">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="px-3 py-2 text-[13px] font-medium text-ink-5 hover:text-ink flex items-center gap-1 transition-colors duration-200"
                >
                  More
                  <ChevronDown size={13} className={`transition-transform duration-300 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-card py-2 z-50 min-w-[200px] animate-slide-down !rounded-xl">
                      <div className="px-4 py-2 border-b border-black/[0.04]">
                        <p className="caption text-ink-5">More Sections</p>
                      </div>
                      {MORE_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2.5 text-[13px] font-medium text-ink-3 hover:text-ink hover:bg-pearl/60 transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 hover:bg-pearl rounded-xl transition-all duration-200 group"
                aria-label="Search"
              >
                <Search size={17} className="text-ink-5 group-hover:text-ink-3 transition-colors" />
              </button>

              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 hover:bg-pearl rounded-xl transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md" style={{ background: 'var(--gradient-red)' }}>
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 glass-card py-2 z-50 min-w-[220px] animate-slide-down !rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-br from-pearl to-white border-b border-black/[0.04]">
                          <p className="text-[13px] font-bold text-ink">{session.user?.name}</p>
                          <p className="text-[11px] text-ink-5 mt-0.5">{session.user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/cms" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-ink-3 hover:text-ink hover:bg-pearl/60 transition-all">
                            <LayoutDashboard size={15} className="text-ink-5" /> CMS Dashboard
                          </Link>
                          <Link href="/bookmarks" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-ink-3 hover:text-ink hover:bg-pearl/60 transition-all">
                            <Bookmark size={15} className="text-ink-5" /> Bookmarks
                          </Link>
                        </div>
                        <div className="border-t border-black/[0.04] pt-1">
                          <button
                            onClick={async () => {
                              const { signOut } = await import('next-auth/react');
                              await signOut({ callbackUrl: '/' });
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50/60 w-full text-left transition-all"
                          >
                            <LogOut size={15} /> Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-primary hidden sm:inline-flex text-[13px] px-5 py-2">
                  Sign in
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 hover:bg-pearl rounded-xl transition-all"
                aria-label="Menu"
              >
                <Menu size={19} className="text-ink-3" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] animate-in"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        >
          <div
            className="w-full max-w-[620px] mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card !rounded-2xl overflow-hidden !shadow-[0_25px_80px_rgba(0,0,0,0.15)]">
              <form onSubmit={handleSearchSubmit} className="flex items-center px-5 border-b border-black/[0.04]">
                <Search size={18} className="text-ink-6 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, reporters..."
                  className="flex-1 py-4 px-3 text-[15px] font-medium outline-none bg-transparent text-ink placeholder:text-ink-5"
                />
                <kbd className="hidden sm:flex items-center px-2 py-0.5 text-[10px] font-mono text-ink-5 bg-pearl rounded-md border border-black/[0.06]">ESC</kbd>
              </form>

              {searchResults.length > 0 && (
                <div className="max-h-80 overflow-y-auto py-1">
                  {searchResults.map((hit: any) => (
                    <Link
                      key={hit.id}
                      href={`/${hit.categorySlug || 'pakistan'}/${hit.slug}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-start gap-4 px-5 py-3.5 hover:bg-pearl/60 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-ink truncate">{hit.title}</p>
                        <p className="text-[11px] text-ink-5 mt-1 font-medium">{hit.category} · {hit.readingTimeMinutes} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!searchQuery && (
                <div className="px-5 py-5">
                  <p className="caption text-ink-5 mb-3">Trending Now</p>
                  <div className="flex flex-wrap gap-2">
                    {['Economy', 'Cricket', 'Elections', 'Technology', 'Climate'].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => { router.push(`/search?q=${topic}`); setSearchOpen(false); }}
                        className="btn-pill"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 animate-in"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-[300px] bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.1)] animate-slide-left">
            <div className="flex items-center justify-between px-5 h-[54px] border-b border-black/[0.04]">
              <span className="font-serif text-lg font-extrabold">
                <span className="text-brand-red">kh</span>abar<span className="text-brand-gold">.</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-pearl rounded-xl transition-colors">
                <X size={19} className="text-ink-4" />
              </button>
            </div>
            <div className="py-3 px-2">
              {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-[14px] font-medium text-ink-3 hover:text-ink hover:bg-pearl/60 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {!session && (
                <div className="px-4 pt-5 mt-3 border-t border-black/[0.04]">
                  <Link href="/login" className="btn-primary w-full text-center py-3">
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
