'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Phrase, Category, Language } from '@/types/phrase';
import { useAppStore } from '@/store/phraseStore';

interface Props {
  language: Language;
  category: Category;
  phrase?:  Phrase;         // if provided → edit mode
  onClose:  () => void;
}

export function PhraseModal({ language, category, phrase, onClose }: Props) {
  const addPhrase    = useAppStore(s => s.addPhrase);
  const updatePhrase = useAppStore(s => s.updatePhrase);

  const [jaText,     setJaText]     = useState(phrase?.jaText     ?? '');
  const [targetText, setTargetText] = useState(phrase?.targetText ?? '');
  const [katakana,   setKatakana]   = useState(phrase?.katakana   ?? '');
  const [notes,      setNotes]      = useState(phrase?.notes      ?? '');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleTranslate = async () => {
    if (!jaText.trim()) { setError('日本語テキストを入力してください'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          jaText,
          targetLanguage: `${language.name} (${language.nativeName})`,
          bcp47:          language.bcp47,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'API エラー');
      const data = await res.json();
      setTargetText(data.targetText);
      setKatakana(data.katakana);
      setNotes(data.notes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!jaText.trim() || !targetText.trim() || !katakana.trim()) {
      setError('日本語・翻訳・カタカナは必須です');
      return;
    }
    const input = { jaText, targetText, katakana, notes };
    if (phrase) {
      updatePhrase(language.id, category.id, phrase.id, input);
    } else {
      addPhrase(language.id, category.id, input);
    }
    onClose();
  };

  const modalContent = (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{phrase ? 'フレーズを編集' : 'フレーズを追加'}</h2>
        <p className="modal-context" aria-label="追加先">
          <span className="modal-context-lang">{language.flag} {language.name}</span>
          <span className="modal-context-sep">›</span>
          <span className="modal-context-cat">{category.icon} {category.name}</span>
        </p>

        <label className="field-label">日本語</label>
        <div className="field-row">
          <input
            className="field-input"
            value={jaText}
            onChange={e => setJaText(e.target.value)}
            placeholder="例: ありがとう"
          />
          <button
            className="btn-translate"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? '翻訳中…' : `✨ AI翻訳`}
          </button>
        </div>

        <label className="field-label">{language.nativeName} テキスト</label>
        <input
          className="field-input"
          value={targetText}
          onChange={e => setTargetText(e.target.value)}
          placeholder="翻訳後のテキスト"
        />

        <label className="field-label">カタカナ読み</label>
        <input
          className="field-input"
          value={katakana}
          onChange={e => setKatakana(e.target.value)}
          placeholder="例: サン・キュー"
        />

        <label className="field-label">補足（任意）</label>
        <textarea
          className="field-input field-textarea"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="使用場面やニュアンス"
          rows={2}
        />

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-primary" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
}
