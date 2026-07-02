// ═══════════════════════════════════════════════════════════════════
// KHABAR ISLAMABAD — AI Utility (Gemini Flash)
// Uses Google Gemini API for all AI features
// ═══════════════════════════════════════════════════════════════════

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  process.env.GEMINI_API_URL ||
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
}

interface GeminiRequest {
  contents: GeminiContent[];
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const SYSTEM_CONTEXT =
  'You are an editorial AI assistant for Khabar Islamabad, a premium Pakistani news platform. Write in formal, professional Pakistani English. Be concise, accurate, and journalistic in tone. Use facts over speculation.';

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const body: GeminiRequest = {
    contents: [
      {
        parts: [
          { text: SYSTEM_CONTEXT },
          { text: prompt },
        ],
      },
    ],
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini');
  }

  return text.trim();
}

// ── Generate Summary ─────────────────────────────────────────────

export async function generateSummary(content: string): Promise<string> {
  const prompt = `Summarize the following news article in 2-3 concise sentences. Focus on the key facts, who, what, when, where, and why. Keep it under 80 words.

Article:
${content.slice(0, 4000)}`;

  return callGemini(prompt);
}

// ── Generate Headlines ───────────────────────────────────────────

export async function generateHeadlines(
  title: string,
  content: string
): Promise<string[]> {
  const prompt = `Generate 5 alternative headlines for this news article. Each headline should be compelling, accurate, and suitable for a Pakistani news audience. Return only the headlines, one per line, numbered 1-5.

Current title: ${title}

Article excerpt:
${content.slice(0, 2000)}`;

  const result = await callGemini(prompt);
  return result
    .split('\n')
    .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter((line) => line.length > 0)
    .slice(0, 5);
}

// ── Generate SEO Meta ────────────────────────────────────────────

export async function generateSEOMeta(
  title: string,
  content: string
): Promise<{ metaTitle: string; metaDescription: string; keywords: string[] }> {
  const prompt = `Generate SEO metadata for this news article. Return in this exact JSON format:
{
  "metaTitle": "SEO-optimized title (max 60 chars)",
  "metaDescription": "SEO description (max 155 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Title: ${title}
Content excerpt:
${content.slice(0, 3000)}`;

  const result = await callGemini(prompt);
  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }
  return {
    metaTitle: title.slice(0, 60),
    metaDescription: content.slice(0, 155),
    keywords: [],
  };
}

// ── Generate FAQ ─────────────────────────────────────────────────

export async function generateFAQ(
  content: string
): Promise<{ question: string; answer: string }[]> {
  const prompt = `Generate 5 frequently asked questions (FAQs) with answers based on this news article. Each Q&A should provide additional context or clarify key points. Return in this exact JSON format:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."}
]

Article:
${content.slice(0, 4000)}`;

  const result = await callGemini(prompt);
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fallback
  }
  return [];
}

// ── Generate Rewrite ─────────────────────────────────────────────

export async function rewriteContent(content: string): Promise<string> {
  const prompt = `Rewrite and improve the following news article text. Make it more engaging, professional, and well-structured while preserving all facts. Maintain Pakistani English tone. Return only the improved text, no explanations.

Original:
${content.slice(0, 4000)}`;

  return callGemini(prompt);
}

// ── Generate Daily Digest ────────────────────────────────────────

export async function generateDigest(
  topic: string,
  articles: string[]
): Promise<string> {
  const prompt = `Create a brief daily digest summary for the topic "${topic}" based on these recent news headlines. Write 3-4 sentences capturing the key developments. Tone: professional news briefing.

Headlines:
${articles.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;

  return callGemini(prompt);
}

// ── Translate Text ───────────────────────────────────────────────

export async function translateText(
  text: string,
  targetLang: 'ur' | 'es' | 'ar'
): Promise<string> {
  const langNames: Record<string, string> = {
    ur: 'Urdu',
    es: 'Spanish',
    ar: 'Arabic',
  };

  const prompt = `Translate the following text to ${langNames[targetLang]}. Preserve any HTML tags. Return only the translated text, nothing else.

Text:
${text.slice(0, 6000)}`;

  return callGemini(prompt);
}
