import { NextRequest, NextResponse } from 'next/server';
import {
  generateSummary,
  generateHeadlines,
  generateSEOMeta,
  generateFAQ,
  rewriteContent,
  generateDigest,
} from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, title } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    // Digest and summary work without auth (public features)
    if (type === 'digest') {
      if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
      const digest = await generateDigest(title || 'general', content.split('\n'));
      return NextResponse.json({ digest });
    }

    if (type === 'summary') {
      if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
      const summary = await generateSummary(content);
      return NextResponse.json({ summary });
    }

    if (type === 'faq') {
      if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
      const faqs = await generateFAQ(content);
      return NextResponse.json({ faqs });
    }

    // Other AI features work without auth too (for CMS)
    let result: any;

    switch (type) {
      case 'headlines':
        if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
        result = { headlines: await generateHeadlines(title, content) };
        break;

      case 'seo':
        if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
        result = await generateSEOMeta(title, content);
        break;

      case 'rewrite':
        if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
        result = { improved: await rewriteContent(content) };
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: error.message || 'AI processing failed' },
      { status: 503 }
    );
  }
}
