// KHABAR ISLAMABAD — AI Utility (Groq - Free & Fast)
// Uses Groq API with Llama 3 model

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

const SYSTEM_CONTEXT =
  'You are an editorial AI assistant for Khabar Islamabad, a premium Pakistani news platform. Write in formal, professional Pakistani English. Be concise, accurate, and journalistic in tone.';

async function callGroq(userPrompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_CONTEXT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response from Groq');
  }

  return text.trim();
}

// Generate Summary
export async function generateSummary(content: string): Promise<string> {
  const prompt = `Summarize the following news article in 2-3 concise sentences. Focus on the key facts. Keep it under 80 words.\n\nArticle:\n${content.slice(0, 4000)}`;
  return callGroq(prompt);
}

// Generate Headlines
export async function generateHeadlines(title: string, content: string): Promise<string[]> {
  const prompt = `Generate 5 alternative headlines for this news article. Return only the headlines, one per line, numbered 1-5.\n\nCurrent title: ${title}\n\nArticle excerpt:\n${content.slice(0, 2000)}`;
  const result = await callGroq(prompt);
  return result
    .split('\n')
    .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);
}

// Generate SEO Meta
export async function generateSEOMeta(
  title: string,
  content: string
): Promise<{ metaTitle: string; metaDescription: string; keywords: string[] }> {
  const prompt = `Generate SEO metadata for this news article. Return in this exact JSON format:\n{"metaTitle": "SEO-optimized title (max 60 chars)", "metaDescription": "SEO description (max 155 chars)", "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]}\n\nTitle: ${title}\nContent excerpt:\n${content.slice(0, 3000)}`;
  const result = await callGroq(prompt);
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}
  return {
    metaTitle: title.slice(0, 60),
    metaDescription: content.slice(0, 155),
    keywords: [],
  };
}

// Generate FAQ
export async function generateFAQ(
  content: string
): Promise<{ question: string; answer: string }[]> {
  const prompt = `Generate 5 FAQs with answers based on this news article. Return in this exact JSON format:\n[{"question": "...", "answer": "..."}]\n\nArticle:\n${content.slice(0, 4000)}`;
  const result = await callGroq(prompt);
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {}
  return [];
}

// Rewrite Content
export async function rewriteContent(content: string): Promise<string> {
  const prompt = `Rewrite and improve the following news article text. Make it more engaging and professional. Return only the improved text.\n\nOriginal:\n${content.slice(0, 4000)}`;
  return callGroq(prompt);
}

// Generate Daily Digest
export async function generateDigest(topic: string, articles: string[]): Promise<string> {
  const prompt = `Create a brief daily digest summary for the topic "${topic}" based on these recent news headlines. Write 3-4 sentences.\n\nHeadlines:\n${articles.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
  return callGroq(prompt);
}

// Translate Text
export async function translateText(
  text: string,
  targetLang: 'ur' | 'es' | 'ar'
): Promise<string> {
  const langNames: Record<string, string> = {
    ur: 'Urdu',
    es: 'Spanish',
    ar: 'Arabic',
  };

  const prompt = `Translate the following text to ${langNames[targetLang]}. Preserve any HTML tags. Return only the translated text.\n\nText:\n${text.slice(0, 6000)}`;
  return callGroq(prompt);
}
