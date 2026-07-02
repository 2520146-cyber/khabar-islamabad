'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setSubscribed(true); setEmail(''); }
    } catch {}
    setSubscribing(false);
  };

  const columns = [
    {
      title: 'About',
      links: [
        { label: 'About us', href: '/about' },
        { label: 'Editorial policy', href: '/about' },
        { label: 'Careers', href: '/about' },
        { label: 'Advertise', href: '/about' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { label: 'Pakistan', href: '/pakistan' },
        { label: 'Politics', href: '/politics' },
        { label: 'Business', href: '/business' },
        { label: 'Sports', href: '/sports' },
        { label: 'Tech', href: '/technology' },
      ],
    },
    {
      title: 'Sections',
      links: [
        { label: 'Opinion', href: '/opinion' },
        { label: 'Videos', href: '/videos' },
        { label: 'Podcasts', href: '/podcasts' },
        { label: 'Photo Stories', href: '/photo-stories' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy policy', href: '/legal' },
        { label: 'Terms of use', href: '/legal' },
        { label: 'Cookie policy', href: '/legal' },
        { label: 'DMCA', href: '/legal' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'newsdesk@khabar.pk', href: 'mailto:newsdesk@khabar.pk' },
        { label: '+92 51 000 0000', href: 'tel:+92510000000' },
        { label: 'Islamabad, Pakistan', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { label: 'X / Twitter', href: 'https://twitter.com/khabarislamabad' },
    { label: 'Facebook', href: 'https://facebook.com/khabarislamabad' },
    { label: 'Instagram', href: 'https://instagram.com/khabarislamabad' },
    { label: 'YouTube', href: 'https://youtube.com/khabarislamabad' },
  ];

  return (
    <footer className="bg-ink noise-overlay no-print" style={{ background: 'var(--gradient-dark)' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top — Logo + Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 py-14 border-b border-white/[0.06]">
          <div>
            <Link href="/" className="inline-flex items-baseline group">
              <span className="font-serif text-[28px] font-extrabold text-brand-red tracking-[-0.03em] group-hover:opacity-80 transition-opacity">kh</span>
              <span className="font-serif text-[28px] font-extrabold text-white tracking-[-0.03em] group-hover:opacity-80 transition-opacity">abar</span>
              <span className="text-brand-gold text-[28px] font-extrabold ml-[2px]">.</span>
            </Link>
            <p className="text-[13px] text-white/30 mt-3 max-w-sm leading-relaxed">
              Pakistan&apos;s most trusted digital newsroom. Breaking news, in-depth analysis, and AI-powered insights from Islamabad and across Pakistan.
            </p>
          </div>

          <div className="flex-shrink-0">
            <p className="caption text-white/20 mb-4">Subscribe to our newsletter</p>
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <span className="text-green-400 text-sm">✓</span>
                <span className="text-green-400 text-[13px] font-medium">Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-brand-red/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(192,22,29,0.1)] transition-all duration-300 w-64"
                />
                <button type="submit" disabled={subscribing} className="btn-primary px-6 py-3 text-[13px] disabled:opacity-50">
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle — Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 py-14 border-b border-white/[0.06]">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="caption text-white/15 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-white/35 hover:text-white/80 transition-colors duration-300 font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-white/20 hover:text-white/60 transition-colors duration-300 tracking-[0.05em] uppercase"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-[11px] text-white/15 font-medium">
              © 2026 Khabar Islamabad. All Rights Reserved.
            </p>
            <p className="text-[10px] text-white/10 mt-1">
              Designed &amp; Developed by <span className="text-white/25 font-semibold">Abdullah Ashfaq Raja</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
