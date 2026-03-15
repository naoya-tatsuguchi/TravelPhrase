'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/phraseStore';

// 旅行フレーズ向けの実用的なプリセットアイコン（挨拶・食事・買い物・交通・宿泊・緊急・場所・会話・観光など）
const PRESET_ICONS = [
  '👋', '🤝', '🙏',           // 挨拶・基本
  '🍽️', '☕', '🍕', '🥢', '🍜', '🍺',  // 食事
  '🛍️', '💰', '🛒',          // 買い物
  '🚕', '🚌', '✈️', '🚂', '🚢', '🚇',  // 交通
  '🏨', '🧳',                 // 宿泊
  '🆘', '💊', '🏥',          // 緊急・医療
  '📍', '🗺️', '🚻', '🚾',    // 場所・案内
  '💬', '📞', '📷',          // 会話・連絡
  '🎫', '📸', '🏛️', '⛰️', '🏖️',  // 観光・娯楽
  '🌏', '🎒', '🧭',          // 旅行全般
];

interface Props {
  languageId: string;
  onClose:    () => void;
}

export function CategoryModal({ languageId, onClose }: Props) {
  const addCategory = useAppStore(s => s.addCategory);
  const [name,         setName]         = useState('');
  const [selectedPreset, setSelectedPreset] = useState('💬');
  const [customIcon,    setCustomIcon]    = useState('');
  const [error,        setError]        = useState('');

  const effectiveIcon = customIcon.trim() || selectedPreset;

  const handlePresetClick = (em: string) => {
    setSelectedPreset(em);
    setCustomIcon('');
  };

  const handleSave = () => {
    if (!name.trim()) { setError('カテゴリー名を入力してください'); return; }
    if (!effectiveIcon) { setError('アイコンを選択または入力してください'); return; }
    addCategory(languageId, { name: name.trim(), icon: effectiveIcon });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">カテゴリーを追加</h2>

        <label className="field-label">アイコン（プリセットから選択）</label>
        <div className="icon-grid">
          {PRESET_ICONS.map(em => (
            <button
              key={em}
              type="button"
              className={`icon-btn ${!customIcon && selectedPreset === em ? 'icon-btn--active' : ''}`}
              onClick={() => handlePresetClick(em)}
              title={em}
            >
              {em}
            </button>
          ))}
        </div>

        <label className="field-label">または自分で入力</label>
        <div className="icon-custom-wrap">
          <input
            type="text"
            className="field-input icon-custom-input"
            value={customIcon}
            onChange={e => setCustomIcon(e.target.value)}
            placeholder="絵文字を直接入力（例：🍜）"
            maxLength={8}
            aria-label="カスタムアイコン入力"
          />
          {customIcon && (
            <span className="icon-custom-preview" aria-hidden>{customIcon}</span>
          )}
        </div>

        <label className="field-label">カテゴリー名</label>
        <input
          className="field-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例: レストランで"
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-primary" onClick={handleSave}>追加</button>
        </div>
      </div>
    </div>
  );
}
