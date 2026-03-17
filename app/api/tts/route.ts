import { NextRequest, NextResponse } from 'next/server';

type TtsRequest = {
  text: string;
  lang: string; // BCP-47 (e.g. en-US)
  speakingRate?: number;
  pitch?: number;
};

function getPrimaryLang(lang: string): string {
  return lang.split('-')[0] || lang;
}

async function synthesizeViaGoogleTts(params: { apiKey: string; text: string; lang: string; speakingRate?: number; pitch?: number }) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(params.apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      input: { text: params.text },
      voice: {
        languageCode: params.lang,
        ssmlGender: 'NEUTRAL',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: params.speakingRate ?? 1.0,
        pitch: params.pitch ?? 0.0,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`google_tts_error:${res.status}:${text}`);
  }
  const json = (await res.json()) as { audioContent?: string };
  if (!json.audioContent) throw new Error('google_tts_error:no_audioContent');
  return { audioContentBase64: json.audioContent, mime: 'audio/mpeg' as const };
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'TTS が未設定です（GOOGLE_CLOUD_TTS_API_KEY）' }, { status: 501 });
    }

    const body = (await req.json()) as Partial<TtsRequest>;
    const text = (body.text ?? '').trim();
    const lang = (body.lang ?? '').trim();

    if (!text || !lang) {
      return NextResponse.json({ error: 'text と lang は必須です' }, { status: 400 });
    }

    // まず BCP-47 を優先。失敗したら primary にフォールバック。
    try {
      const out = await synthesizeViaGoogleTts({
        apiKey,
        text,
        lang,
        speakingRate: body.speakingRate,
        pitch: body.pitch,
      });
      return NextResponse.json(out);
    } catch (e) {
      const primary = getPrimaryLang(lang);
      if (primary && primary !== lang) {
        const out = await synthesizeViaGoogleTts({
          apiKey,
          text,
          lang: primary,
          speakingRate: body.speakingRate,
          pitch: body.pitch,
        });
        return NextResponse.json(out);
      }
      throw e;
    }
  } catch (err) {
    console.error('[/api/tts]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '不明なエラー' },
      { status: 500 }
    );
  }
}

