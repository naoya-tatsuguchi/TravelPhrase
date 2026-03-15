'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** BCP-47 で指定された言語に利用可能な音声があるか */
function hasVoiceForLang(voices: SpeechSynthesisVoice[], lang: string): boolean {
  if (!lang || !voices.length) return false;
  const primary = lang.split('-')[0];
  return voices.some(
    (v) =>
      v.lang === lang ||
      v.lang.startsWith(primary + '-') ||
      v.lang === primary
  );
}

/** ネイティブ発音に近づけるため、対象言語に最適な音声を選択 */
function selectVoiceForLang(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (!lang || !voices.length) return null;
  const primary = lang.split('-')[0];

  // 1. 完全一致（例: en-US）
  let best = voices.find((v) => v.lang === lang);
  if (best) return best;

  // 2. 同じ言語の地域変種（例: en-GB, en-AU）
  const matches = voices.filter((v) => v.lang.startsWith(primary + '-'));
  if (matches.length > 0) {
    // local を優先（端末のロケールに近い音声）、次に default
    best = matches.find((v) => v.localService) ?? matches.find((v) => v.default) ?? matches[0];
    return best;
  }

  // 3. プライマリ言語のみ（例: en）
  best = voices.find((v) => v.lang === primary);
  return best ?? null;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speakError, setSpeakError] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSpeechSupported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Android Chrome: getVoices() は初回は空配列を返し、音声が非同期で遅れて読み込まれることがある。
    // voiceschanged が発火しない端末もあるため、複数回・長めの遅延でリトライする。
    const timeouts = [50, 200, 500, 1000, 2000, 3000].map((ms) => setTimeout(loadVoices, ms));
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isSpeechSupported]);

  // 音声リストが空（未読み込み）のときも true にし、再生を試行する。
  // Android では getVoices() が空のままでも、utterance.lang のみ指定すればデフォルトエンジンで再生される端末がある。
  const canSpeak = useCallback(
    (lang: string) =>
      isSpeechSupported &&
      (voices.length === 0 || hasVoiceForLang(voices, lang)),
    [isSpeechSupported, voices]
  );

  const speak = useCallback(
    (text: string, lang: string, phraseId: string) => {
      if (!isSpeechSupported) {
        setSpeakError('unsupported');
        return;
      }
      if (!text?.trim()) return;

      setSpeakError(null);
      window.speechSynthesis.cancel();

      // タップ直前に再取得。Android ではこのタイミングで初めて getVoices() が返る端末がある。
      const voicesNow = window.speechSynthesis.getVoices();
      const voice = selectVoiceForLang(voicesNow, lang);

      const utter = new SpeechSynthesisUtterance(text.trim());
      utter.lang = lang;
      utter.rate = 0.85;
      utter.pitch = 1;
      utter.volume = 1;
      if (voice) utter.voice = voice;

      utter.onstart = () => setSpeaking(phraseId);
      utter.onend = () => {
        setSpeaking(null);
        setSpeakError(null);
      };
      utter.onerror = () => {
        setSpeaking(null);
        setSpeakError(phraseId);
      };

      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    },
    [isSpeechSupported]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
    setSpeakError(null);
  }, []);

  /** 再生に失敗したフレーズID（そのカードでエラー表示用） */
  return { speak, stop, speaking, canSpeak, isSpeechSupported, speakError, clearSpeakError: () => setSpeakError(null) };
}
