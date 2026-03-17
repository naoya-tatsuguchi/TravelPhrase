'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { getCachedAudio, setCachedAudio } from '@/lib/ttsCache';

function toBase64Bytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

type TtsResponse = { audioContentBase64: string; mime: string };

export function useVoicePlayback() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const isAudioSupported = typeof window !== 'undefined' && typeof Audio !== 'undefined';
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    try {
      audioRef.current?.pause();
      audioRef.current = null;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    } catch {
      // noop
    }
    window.speechSynthesis?.cancel?.();
    setPlaying(null);
    setPlayError(null);
  }, []);

  const canPlay = useMemo(() => isAudioSupported || isSpeechSupported, [isAudioSupported, isSpeechSupported]);

  const play = useCallback(
    async (text: string, lang: string, phraseId: string) => {
      if (!text?.trim()) return;
      if (!canPlay) {
        setPlayError('unsupported');
        return;
      }

      setPlayError(null);

      // すでに再生中なら停止
      if (playing === phraseId) {
        stop();
        return;
      }

      // まずクラウドTTS（音声ファイル）を試す。ダメなら Web Speech にフォールバック。
      try {
        const key = await sha256Hex(`${lang}::${text.trim()}`);
        const cached = await getCachedAudio(key);

        let mime: string;
        let data: ArrayBuffer;
        if (cached) {
          mime = cached.mime;
          data = cached.data;
        } else {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text: text.trim(), lang, speakingRate: 1.0, pitch: 0.0 }),
          });
          if (!res.ok) throw new Error(`tts_http_${res.status}`);
          const json = (await res.json()) as TtsResponse;
          const bytes = toBase64Bytes(json.audioContentBase64);
          mime = json.mime;
          // Uint8Array#buffer は ArrayBuffer | SharedArrayBuffer になり得るため ArrayBuffer にコピーする
          data = bytes.slice().buffer;
          await setCachedAudio({ key, mime, data });
        }

        // Audio 再生
        stop(); // 既存再生/URLを片付ける
        const blob = new Blob([data], { type: mime });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => stop();
        audio.onerror = () => {
          setPlaying(null);
          setPlayError(phraseId);
        };
        setPlaying(phraseId);
        await audio.play();
        return;
      } catch (e) {
        // fallback
        try {
          if (!isSpeechSupported) throw e;
          stop();
          const utter = new SpeechSynthesisUtterance(text.trim());
          utter.lang = lang;
          utter.rate = 0.85;
          utter.onstart = () => setPlaying(phraseId);
          utter.onend = () => {
            setPlaying(null);
            setPlayError(null);
          };
          utter.onerror = () => {
            setPlaying(null);
            setPlayError(phraseId);
          };
          window.speechSynthesis.speak(utter);
        } catch {
          setPlaying(null);
          setPlayError(phraseId);
        }
      }
    },
    [canPlay, isSpeechSupported, playing, stop]
  );

  return {
    play,
    stop,
    playing,
    canPlay,
    playError,
    isAudioSupported,
    isSpeechSupported,
    clearPlayError: () => setPlayError(null),
  };
}

