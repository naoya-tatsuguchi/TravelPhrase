'use client';

import { useState, type MouseEvent } from 'react';
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
  const [showZoom, setShowZoom] = useState(false);
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

  const handleOpenZoom = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button,a,input,textarea,label')) return;
    setShowZoom(true);
  };

  return (
    <>
    <div
      className="phrase-card group"
      onClick={handleOpenZoom}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setShowZoom(true);
        }
      }}
      role="button"
      tabIndex={0}
      title="タップで拡大表示"
    >
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
            <button className="btn-speak btn-speak--disabled" disabled aria-label="音声再生非対応" onClick={(e) => e.stopPropagation()}>▶</button>
            <span className="speech-unavailable-msg">非対応</span>
          </span>
        ) : playbackFailed ? (
          <span className="speech-unavailable" title={`${language.name}の音声再生に失敗しました`}>
            <button className="btn-speak btn-speak--disabled" disabled aria-label="再生失敗" onClick={(e) => e.stopPropagation()}>▶</button>
            <span className="speech-unavailable-msg speech-unavailable-msg--error">{language.name}再生不可</span>
          </span>
        ) : (
          <button
            className={`btn-speak ${isSpeaking ? 'btn-speak--active' : ''}`}
            onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
            aria-label={isSpeaking ? '停止' : '音声再生'}
            title={isSpeaking ? '停止' : '音声再生'}
          >
            {isSpeaking ? '■' : '▶'}
          </button>
        )}
        {isLoggedIn ? (
          <>
            {onEdit && (
              <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onEdit(); }} title="編集">✏️</button>
            )}
            <button className="btn-icon btn-icon--danger" onClick={(e) => { e.stopPropagation(); handleDelete(); }} title="削除">🗑️</button>
          </>
        ) : (
          <button
            className="btn-icon btn-icon--login"
            onClick={(e) => { e.stopPropagation(); onLoginRequest?.(); }}
            title="ログインして編集"
          >
            ログイン
          </button>
        )}
      </div>
    </div>
    {showZoom && (
      <div className="phrase-zoom-overlay" onClick={() => setShowZoom(false)}>
        <div className="phrase-zoom-modal" onClick={(e) => e.stopPropagation()}>
          <p className="phrase-zoom-lang">{language.flag} {language.name}</p>
          <p className="phrase-zoom-katakana">{phrase.katakana}</p>
          <p className="phrase-zoom-target">{phrase.targetText}</p>
          <p className="phrase-zoom-ja">{phrase.jaText}</p>
          <button className="phrase-zoom-close-btn" onClick={() => setShowZoom(false)}>閉じる</button>
        </div>
      </div>
    )}
    </>
  );
}
