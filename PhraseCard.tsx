'use client';

import { useState } from 'react';
import type { Phrase, Category, Language } from '@/types/phrase';
import { useAppStore } from '@/store/phraseStore';
import { useSpeech } from '@/hooks/useSpeech';

interface Props {
  phrase:   Phrase;
  category: Category;
  language: Language;
  onEdit?:  () => void;
}

export function PhraseCard({ phrase, category, language, onEdit }: Props) {
  const deletePhrase = useAppStore(s => s.deletePhrase);
  const { speak, stop, speaking } = useSpeech();
  const [showNotes, setShowNotes] = useState(false);
  const isSpeaking = speaking === phrase.id;

  const handleSpeak = () => {
    if (isSpeaking) { stop(); return; }
    speak(phrase.targetText, language.bcp47, phrase.id);
  };

  const handleDelete = () => {
    if (confirm(`「${phrase.jaText}」を削除しますか？`)) {
      deletePhrase(language.id, category.id, phrase.id);
    }
  };

  return (
    <div className="phrase-card group">
      {/* Ruby text: katakana above targetText */}
      <div className="phrase-ruby-wrap">
        <ruby className="phrase-ruby">
          <span className="phrase-target">{phrase.targetText}</span>
          <rt className="phrase-rt">{phrase.katakana}</rt>
        </ruby>
      </div>

      <div className="phrase-ja">{phrase.jaText}</div>

      {phrase.notes && (
        <button
          className="phrase-notes-toggle"
          onClick={() => setShowNotes(v => !v)}
          aria-expanded={showNotes}
        >
          {showNotes ? '▲ 補足を閉じる' : '▼ 補足を見る'}
        </button>
      )}
      {showNotes && phrase.notes && (
        <p className="phrase-notes">{phrase.notes}</p>
      )}

      {/* Actions */}
      <div className="phrase-actions">
        <button
          className={`btn-speak ${isSpeaking ? 'btn-speak--active' : ''}`}
          onClick={handleSpeak}
          aria-label={isSpeaking ? '停止' : '音声再生'}
          title={isSpeaking ? '停止' : '音声再生'}
        >
          {isSpeaking ? '■' : '▶'}
        </button>
        {onEdit && (
          <button className="btn-icon" onClick={onEdit} title="編集">✏️</button>
        )}
        <button className="btn-icon btn-icon--danger" onClick={handleDelete} title="削除">🗑️</button>
      </div>
    </div>
  );
}
