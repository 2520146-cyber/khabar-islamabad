# 🇵🇰 Khabar Islamabad — Pakistan's Premium Digital Newsroom

> Built by **Abdullah Ashfaq Raja** | Khabar Islamabad

A world-class, AI-powered news platform built with Next.js 14, featuring real-time translation, Gemini AI integration, and a complete CMS newsroom.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd khabar-islamabad
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your actual values

# 3. Set up database
npx prisma db push
npx prisma generate

# 4. Seed the database
npx ts-node prisma/seed.ts

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@khabar.pk | admin123 |
| Reporter | reporter@khabar.pk | reporter123 |

---

## 🏗 Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5
- **AI:** Google Gemini Flash (summaries, translations, SEO, FAQ)
- **Weather:** Open-Meteo (free, no API key)
- **Prayer Times:** Aladhan API (free, no API key)
- **Styling:** Tailwind CSS + @tailwindcss/typography
- **State:** Zustand + React Query
- **Animations:** Framer Motion

### Key Features

#### 🌐 Translation System
- AI-powered translation to Urdu (اردو), Spanish (Español), Arabic (العربية)
- RTL support for Urdu and Arabic
- Cached translations in localStorage + database

#### 🤖 AI Features (Powered by Gemini)
- **AI Summary:** Auto-generate 2-3 sentence article summaries
- **Headlines:** Generate 5 alternative headline options
- **SEO Meta:** Auto-generate meta title, description, keywords
- **FAQ:** Generate 5 Q&A pairs from article content
- **Content Rewrite:** AI-powered content improvement
- **Daily Digest:** AI-generated topic summaries

#### 📰 CMS Newsroom
- Block-based content editor with slash commands
- Auto-save every 30 seconds
- Role-based permissions (11 roles)
- Media library management
- Article scheduling
- Revision history

#### 💰 Advertisement System
- 8 ad slot types (banner, sidebar, popup, etc.)
- Impression & click tracking
- Device targeting (desktop/mobile)
- Category-based assignment
- CTR analytics

#### 🔍 Search
- Full-text search with Prisma
- Meilisearch integration (optional)
- Trending topics
- Category filters

#### 📱 PWA Support
- Progressive Web App manifest
- Service worker ready
- Installable on mobile

#### 🕐 Real-time Utilities
- Live weather from Open-Meteo (Islamabad)
- Prayer times from Aladhan API
- Gold price & USD/PKR rate
- Breaking news ticker

---

## 📁 Project Structure

```
khabar-islamabad/
├── app/
│   ├── (public)/          # Public-facing pages
│   ├── (cms)/             # CMS newsroom (auth protected)
│   ├── (admin)/           # Admin dashboard
│   └── api/               # API routes
├── components/
│   ├── layout/            # Header, footer, nav
│   ├── article/           # Article components
│   ├── home/              # Homepage components
│   ├── timeline/          # Timeline components
│   ├── cms/               # CMS editor components
│   └── ads/               # Ad components
├── lib/                   # Utilities & configs
├── prisma/                # Database schema & seed
└── styles/                # Global CSS
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Auth encryption key |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `OPEN_METEO_URL` | ❌ | Weather API (defaults to free endpoint) |
| `ALADHAN_API_URL` | ❌ | Prayer times API |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth |
| `MEILISEARCH_HOST` | ❌ | Search engine |
| `CLOUDINARY_URL` | ❌ | Image uploads |

---

## 📊 Attribution

© 2026 Khabar Islamabad. All Rights Reserved.

**Designed & Developed by Abdullah Ashfaq Raja**

This attribution appears on every page of the platform.

---

## 📝 License

Proprietary — All rights reserved by Khabar Islamabad.
