import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  TRANSLATION_SYSTEM_PROMPT,
  buildTranslationPrompt,
  parseTranslationResponse,
} from '@/lib/translationPrompt';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { jaText, targetLanguage, bcp47 } = await req.json();

    if (!jaText || !targetLanguage || !bcp47) {
      return NextResponse.json({ error: 'jaText, targetLanguage, bcp47 は必須です' }, { status: 400 });
    }

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 512,
      system:     TRANSLATION_SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: buildTranslationPrompt({ jaText, targetLanguage, bcp47 }) }],
    });

    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json(parseTranslationResponse(rawText));
  } catch (err) {
    console.error('[/api/translate]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '不明なエラー' },
      { status: 500 }
    );
  }
}
