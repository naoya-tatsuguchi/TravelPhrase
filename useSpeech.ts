'use client';

import { useCallback, useRef, useState } from 'react';

export function useSpeech() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string, phraseId: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utter  = new SpeechSynthesisUtterance(text);
    utter.lang   = lang;
    utter.rate   = 0.85;
    utter.pitch  = 1;
    utter.volume = 1;

    utter.onstart = () => setSpeaking(phraseId);
    utter.onend   = () => setSpeaking(null);
    utter.onerror = () => setSpeaking(null);

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  }, []);

  return { speak, stop, speaking };
}
