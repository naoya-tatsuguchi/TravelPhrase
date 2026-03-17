'use client';

import { useState } from 'react';
import type { Phrase, Category, Language } from '@/types/phrase';
import { useAppStore } from '@/store/phraseStore';
import { useVoicePlayback } from '@/hooks/useVoicePlayback';

interface Props {
  phrase:   Phrase;
  category: Category;
  language: Language;
  isLoggedIn: boolean;
  onEdit?:  () => void;
  onLoginRequest?: () => void;
}

export function PhraseCard({ phrase, category, language, isLoggedIn, onEdit, onLoginRequest }: Props) {
  const deletePhrase = useAppStore(s => s.deletePhrase);
  const { play, stop, playing, canPlay, playError, clearPlayError } = useVoicePlayback();
  const [showNotes, setShowNotes] = useState(false);
  const isSpeaking = playing === phrase.id;
  const playbackFailed = playError === phrase.id;

  const handleSpeak = () => {
    if (isSpeaking) { stop(); return; }
    clearPlayError?.();
    play(phrase.targetText, language.bcp47, phrase.id);
  };

  const handleDelete = () => {
    if (!isLoggedIn && onLoginRequest) { onLoginRequest(); return; }
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
        {!canPlay ? (
          <span className="speech-unavailable" title="音声再生はお使いのブラウザに対応していません">
            <button className="btn-speak btn-speak--disabled" disabled aria-label="音声再生非対応">▶</button>
            <span className="speech-unavailable-msg">非対応</span>
          </span>
        ) : playbackFailed ? (
          <span className="speech-unavailable" title={`${language.name}の音声再生に失敗しました`}>
            <button className="btn-speak btn-speak--disabled" disabled aria-label="再生失敗">▶</button>
            <span className="speech-unavailable-msg speech-unavailable-msg--error">{language.name}再生不可</span>
          </span>
        ) : (
          <button
            className={`btn-speak ${isSpeaking ? 'btn-speak--active' : ''}`}
            onClick={handleSpeak}
            aria-label={isSpeaking ? '停止' : '音声再生'}
            title={isSpeaking ? '停止' : '音声再生'}
          >
            {isSpeaking ? '■' : '▶'}
          </button>
        )}
        {isLoggedIn ? (
          <>
            {onEdit && (
              <button className="btn-icon" onClick={onEdit} title="編集">✏️</button>
            )}
            <button className="btn-icon btn-icon--danger" onClick={handleDelete} title="削除">🗑️</button>
          </>
        ) : (
          <button
            className="btn-icon btn-icon--login"
            onClick={onLoginRequest}
            title="ログインして編集"
          >
            ログイン
          </button>
        )}
      </div>
    </div>
  );
}
