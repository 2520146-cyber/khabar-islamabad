import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, content, title, articleId } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    let result: any;

    switch (type) {
      case 'summary':
        if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
        result = { summary: await generateSummary(content) };
        break;

      case 'headlines':
        if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
        result = { headlines: await generateHeadlines(title, content) };
        break;

      case 'seo':
        if (!title || !content) return NextResponse.json({ error: 'title and content are required' }, { status: 400 });
        result = await generateSEOMeta(title, content);
        break;

      case 'faq':
        if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
        result = { faqs: await generateFAQ(content) };
        break;

      case 'rewrite':
        if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
        result = { improved: await rewriteContent(content) };
        break;

      case 'digest':
        if (!content) return NextResponse.json({ error: 'content (articles list) is required' }, { status: 400 });
        result = { digest: await generateDigest(title || 'general', content.split('\n')) };
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
