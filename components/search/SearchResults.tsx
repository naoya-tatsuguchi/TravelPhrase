'use client';

import type { SearchResult } from '@/types/phrase';
import { useSpeech } from '@/hooks/useSpeech';

interface Props {
  results: SearchResult[];
}

export function SearchResults({ results }: Props) {
  const { speak, stop, speaking, canSpeak, isSpeechSupported, speakError } = useSpeech();

  if (results.length === 0) {
    return <p className="search-empty">該当するフレーズが見つかりませんでした。</p>;
  }

  return (
    <div className="search-results">
      <p className="search-count">{results.length} 件のフレーズが見つかりました</p>
      <div className="phrase-grid">
        {results.map(({ phrase, category, language }) => {
          const isSpeaking = speaking === phrase.id;
          const langSupported = canSpeak(language.bcp47);
          const playbackFailed = speakError === phrase.id;
          const canPlay = isSpeechSupported && langSupported && !playbackFailed;

          return (
            <div key={phrase.id} className="phrase-card">
              <div className="phrase-meta-badge">
                {language.flag} {language.name} › {category.icon} {category.name}
              </div>
              <div className="phrase-ruby-wrap">
                <ruby className="phrase-ruby">
                  <span className="phrase-target">{phrase.targetText}</span>
                  <rt className="phrase-rt">{phrase.katakana}</rt>
                </ruby>
              </div>
              <div className="phrase-ja">{phrase.jaText}</div>
              <div className="phrase-actions">
                {canPlay ? (
                  <button
                    className={`btn-speak ${isSpeaking ? 'btn-speak--active' : ''}`}
                    onClick={() => isSpeaking ? stop() : speak(phrase.targetText, language.bcp47, phrase.id)}
                    aria-label={isSpeaking ? '停止' : '音声再生'}
                  >
                    {isSpeaking ? '■' : '▶'}
                  </button>
                ) : (
                  <span className="speech-unavailable" title={
                    !isSpeechSupported ? '音声再生はお使いのブラウザに対応していません' :
                    !langSupported ? `${language.name}はお使いの環境で音声再生に対応していません` :
                    playbackFailed ? `${language.name}の音声再生に失敗しました` : ''
                  }>
                    <button className="btn-speak btn-speak--disabled" disabled>▶</button>
                    <span className="speech-unavailable-msg speech-unavailable-msg--inline">
                      {!isSpeechSupported ? '非対応' : !langSupported ? `${language.name}非対応` : `${language.name}再生不可`}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
