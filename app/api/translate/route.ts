import { NextRequest, NextResponse } from 'next/server';
import { translateArticle } from '@/lib/translate';

// Simple in-memory rate limit
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per IP per hour
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;

    const current = rateLimit.get(ip);
    if (current && current.resetAt > now) {
      if (current.count >= 10) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
      }
      current.count++;
    } else {
      rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    }

    const body = await request.json();
    const { articleId, targetLang } = body;

    if (!articleId || !targetLang) {
      return NextResponse.json({ error: 'articleId and targetLang are required' }, { status: 400 });
    }

    if (!['ur', 'es', 'ar'].includes(targetLang)) {
      return NextResponse.json({ error: 'targetLang must be ur, es, or ar' }, { status: 400 });
    }

    const result = await translateArticle(articleId, targetLang);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 });
  }
}
