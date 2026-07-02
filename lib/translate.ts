// ═══════════════════════════════════════════════════════════════════
// KHABAR ISLAMABAD — Translation Utility
// Uses Gemini AI for translations (Urdu, Spanish, Arabic)
// ═══════════════════════════════════════════════════════════════════

import prisma from './prisma';
import { translateText } from './ai';

type TargetLang = 'ur' | 'es' | 'ar';

/**
 * Translate an article and persist the translations in the database.
 */
export async function translateArticle(
  articleId: string,
  targetLang: TargetLang
): Promise<{ title: string; subtitle: string; content: string }> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new Error('Article not found');
  }

  // Check if translation already exists
  const titleField = `title${targetLang.charAt(0).toUpperCase() + targetLang.slice(1)}` as
    | 'titleUr'
    | 'titleEs'
    | 'titleAr';
  const contentField = `content${targetLang.charAt(0).toUpperCase() + targetLang.slice(1)}` as
    | 'contentUr'
    | 'contentEs'
    | 'contentAr';

  if (article[titleField] && article[contentField]) {
    return {
      title: article[titleField] || '',
      subtitle: '',
      content: article[contentField] || '',
    };
  }

  // Translate using Gemini
  const [translatedTitle, translatedSubtitle, translatedContent] =
    await Promise.all([
      translateText(article.title, targetLang),
      article.subtitle
        ? translateText(article.subtitle, targetLang)
        : Promise.resolve(''),
      translateText(article.contentHtml, targetLang),
    ]);

  // Save translations to database
  await prisma.article.update({
    where: { id: articleId },
    data: {
      [titleField]: translatedTitle,
      [contentField]: translatedContent,
    },
  });

  return {
    title: translatedTitle,
    subtitle: translatedSubtitle,
    content: translatedContent,
  };
}
