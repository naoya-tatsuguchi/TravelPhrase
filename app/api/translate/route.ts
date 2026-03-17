import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  TRANSLATION_SYSTEM_PROMPT,
  buildTranslationPrompt,
  parseTranslationResponse,
} from '@/lib/translationPrompt';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI翻訳が未設定です（ANTHROPIC_API_KEY）' }, { status: 501 });
    }
    const client = new Anthropic({ apiKey });

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
    // Anthropic SDK のエラーは status を持つことがある
    const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : undefined;
    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: 'AI翻訳の認証に失敗しました。環境変数 ANTHROPIC_API_KEY を確認してください。' },
        { status }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '不明なエラー' },
      { status: 500 }
    );
  }
}
