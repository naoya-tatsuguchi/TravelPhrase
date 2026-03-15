import type { TranslationResult } from '@/types/phrase';

export const TRANSLATION_SYSTEM_PROMPT = `
あなたは旅行フレーズアプリ向けの翻訳・発音アシスタントです。
ユーザーから「日本語テキスト」と「翻訳先言語」が与えられます。

【出力ルール - 厳守】
必ず以下の JSON 形式「だけ」を返してください。前置き・説明・マークダウン記法は一切不要です。

{
  "targetText": "<翻訳先言語のテキスト>",
  "katakana": "<日本語話者向けのカタカナ発音>",
  "notes": "<使用場面・丁寧さ・ニュアンスの補足（1〜2文）>"
}

【カタカナ表記のルール】
1. 日本語話者が「そのまま読めば通じる」発音を優先する。
2. 長音は「ー」で表記（例: スーパー、コーヒー）。
3. 英語の "th" は「ズ/ス」、"r" は「ゥ」等、近似音で表記。
4. 韓国語の濃音・激音は「ッ/ッカ/ッパ」等で区別を明示。
5. タイ語の声調は記号を使わず、音に近いカタカナのみ。
6. フランス語の鼻母音は「アン/オン/アム」等で近似表記。
7. 単語区切りに「・」を使い、リズムが分かるよう表記。
   例: "Thank you very much" → "サン・キュー・ベリー・マッチ"

【翻訳品質のルール】
- 旅行者が実際に使う、自然で簡潔な表現を選ぶ。
- 丁寧すぎず、失礼でもないニュアンスな敬語レベルを基本とする。
`.trim();

export function buildTranslationPrompt(params: {
  jaText: string;
  targetLanguage: string;
  bcp47: string;
}): string {
  return `日本語テキスト: 「${params.jaText}」
翻訳先言語: ${params.targetLanguage}（言語コード: ${params.bcp47}）

上記のルールに従い、JSON のみ返してください。`.trim();
}

export function parseTranslationResponse(raw: string): TranslationResult {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`JSON が見つかりませんでした: ${raw}`);

  const parsed = JSON.parse(jsonMatch[0]);
  const required: (keyof TranslationResult)[] = ['targetText', 'katakana', 'notes'];
  for (const key of required) {
    if (typeof parsed[key] !== 'string' || !parsed[key].trim()) {
      throw new Error(`フィールド "${key}" が不正です`);
    }
  }
  return {
    targetText: parsed.targetText.trim(),
    katakana:   parsed.katakana.trim(),
    notes:      parsed.notes.trim(),
  };
}
