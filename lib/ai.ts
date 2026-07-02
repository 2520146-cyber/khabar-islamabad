const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

const SYSTEM_CONTEXT = 'You are an editorial AI assistant for Khabar Islamabad, a Pakistani news platform. Write in formal, professional Pakistani English. Be concise, accurate, and journalistic in tone.';

async function callGroq(userPrompt: string): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY,
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
    const errBody = await response.text().catch(() => '');
    console.error('Groq API error:', response.status, errBody);
    throw new Error('Groq API error: ' + response.status);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No response from Groq');
  return text.trim();
}

export async function generateSummary(content: string): Promise<string> {
  return callGroq('Summarize this news article in 2-3 sentences. Keep it under 80 words.\n\n' + content.slice(0, 4000));
}

export async function generateHeadlines(title: string, content: string): Promise<string[]> {
  const result = await callGroq('Generate 5 alternative headlines. Return only the headlines, one per line, numbered 1-5.\n\nTitle: ' + title + '\n\nExcerpt:\n' + content.slice(0, 2000));
  return result.split('\n').map((l) => l.replace(/^\d+[.\)]\s*/, '').trim()).filter((l) => l.length > 0).slice(0, 5);
}

export async function generateSEOMeta(title: string, content: string): Promise<{ metaTitle: string; metaDescription: string; keywords: string[] }> {
  const result = await callGroq('Generate SEO metadata as JSON: {"metaTitle":"max 60 chars","metaDescription":"max 155 chars","keywords":["k1","k2","k3"]}\n\nTitle: ' + title + '\nContent:\n' + content.slice(0, 3000));
  try { const m = result.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); } catch (e) {}
  return { metaTitle: title.slice(0, 60), metaDescription: content.slice(0, 155), keywords: [] };
}

export async function generateFAQ(content: string): Promise<{ question: string; answer: string }[]> {
  const result = await callGroq('Generate 5 FAQs as JSON: [{"question":"...","answer":"..."}]\n\nArticle:\n' + content.slice(0, 4000));
  try { const m = result.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch (e) {}
  return [];
}

export async function rewriteContent(content: string): Promise<string> {
  return callGroq('Rewrite and improve this text. Return only the improved version.\n\n' + content.slice(0, 4000));
}

export async function generateDigest(topic: string, articles: string[]): Promise<string> {
  return callGroq('Create a brief daily digest for "' + topic + '" based on these headlines. Write 3-4 sentences.\n\n' + articles.map((a, i) => (i + 1) + '. ' + a).join('\n'));
}

export async function translateText(text: string, targetLang: 'ur' | 'es' | 'ar'): Promise<string> {
  const langs: Record<string, string> = { ur: 'Urdu', es: 'Spanish', ar: 'Arabic' };
  return callGroq('Translate to ' + langs[targetLang] + '. Preserve HTML tags. Return only translated text.\n\n' + text.slice(0, 6000));
}
