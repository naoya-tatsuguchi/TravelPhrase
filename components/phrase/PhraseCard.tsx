'use client';

import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
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
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchScrollingRef = useRef(false);
  const isSpeaking = playing === phrase.id;
  const playbackFailed = playError === phrase.id;

  useEffect(() => {
    if (!showZoom) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowZoom(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showZoom]);

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

  const shouldIgnoreZoomOpen = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return true;
    return !!target.closest('button,a,input,textarea,label');
  };

  const handleOpenZoom = (e: MouseEvent<HTMLDivElement>) => {
    // touch 由来の click と二重発火しないよう、click はマウス操作のみ対象
    if ('detail' in e.nativeEvent && e.nativeEvent.detail === 0) return;
    if (shouldIgnoreZoomOpen(e.target)) return;
    setShowZoom(true);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (shouldIgnoreZoomOpen(e.target)) return;
    const t = e.changedTouches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    isTouchScrollingRef.current = false;
  };

  const handleTouchMove = () => {
    isTouchScrollingRef.current = true;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (shouldIgnoreZoomOpen(e.target)) return;
    const start = touchStartRef.current;
    const t = e.changedTouches[0];
    if (!start || !t) return;

    const dx = Math.abs(t.clientX - start.x);
    const dy = Math.abs(t.clientY - start.y);
    const TAP_MOVE_THRESHOLD = 10;

    // 指の移動が小さい時だけ「タップ」とみなす（スクロール時は開かない）
    const isTap = !isTouchScrollingRef.current || (dx <= TAP_MOVE_THRESHOLD && dy <= TAP_MOVE_THRESHOLD);
    if (isTap && dx <= TAP_MOVE_THRESHOLD && dy <= TAP_MOVE_THRESHOLD) {
      setShowZoom(true);
    }
    touchStartRef.current = null;
    isTouchScrollingRef.current = false;
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
    isTouchScrollingRef.current = false;
  };

  return (
    <>
    <div
      className="phrase-card group"
      onClick={handleOpenZoom}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
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
    {showZoom && typeof document !== 'undefined' && createPortal(
      <div className="phrase-zoom-overlay" onClick={() => setShowZoom(false)}>
        <div className="phrase-zoom-modal" onClick={(e) => e.stopPropagation()}>
          <p className="phrase-zoom-lang">{language.flag} {language.name}</p>
          <p className="phrase-zoom-katakana">{phrase.katakana}</p>
          <p className="phrase-zoom-target">{phrase.targetText}</p>
          <p className="phrase-zoom-ja">{phrase.jaText}</p>
          <button className="phrase-zoom-close-btn" onClick={() => setShowZoom(false)}>閉じる</button>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
