'use client';

import type { SearchResult } from '@/types/phrase';
import { useVoicePlayback } from '@/hooks/useVoicePlayback';

interface Props {
  results: SearchResult[];
}

export function SearchResults({ results }: Props) {
  const { play, stop, playing, canPlay, playError } = useVoicePlayback();

  if (results.length === 0) {
    return <p className="search-empty">該当するフレーズが見つかりませんでした。</p>;
  }

  return (
    <div className="search-results">
      <p className="search-count">{results.length} 件のフレーズが見つかりました</p>
      <div className="phrase-grid">
        {results.map(({ phrase, category, language }) => {
          const isSpeaking = playing === phrase.id;
          const playbackFailed = playError === phrase.id;
          const isPlayable = canPlay && !playbackFailed;

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
                {isPlayable ? (
                  <button
                    className={`btn-speak ${isSpeaking ? 'btn-speak--active' : ''}`}
                    onClick={() => isSpeaking ? stop() : play(phrase.targetText, language.bcp47, phrase.id)}
                    aria-label={isSpeaking ? '停止' : '音声再生'}
                  >
                    {isSpeaking ? '■' : '▶'}
                  </button>
                ) : (
                  <span className="speech-unavailable" title={
                    !canPlay ? '音声再生はお使いのブラウザに対応していません' :
                    playbackFailed ? `${language.name}の音声再生に失敗しました` : ''
                  }>
                    <button className="btn-speak btn-speak--disabled" disabled>▶</button>
                    <span className="speech-unavailable-msg speech-unavailable-msg--inline">
                      {!canPlay ? '非対応' : `${language.name}再生不可`}
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
