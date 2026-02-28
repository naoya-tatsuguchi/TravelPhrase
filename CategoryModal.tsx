'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/phraseStore';

const PRESET_ICONS = ['👋','🍽️','🛍️','🚕','🏨','🆘','📍','💬','🎫','💊','📸','🌏'];

interface Props {
  languageId: string;
  onClose:    () => void;
}

export function CategoryModal({ languageId, onClose }: Props) {
  const addCategory = useAppStore(s => s.addCategory);
  const [name,  setName]  = useState('');
  const [icon,  setIcon]  = useState('💬');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('カテゴリー名を入力してください'); return; }
    addCategory(languageId, { name: name.trim(), icon });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">カテゴリーを追加</h2>

        <label className="field-label">アイコン</label>
        <div className="icon-grid">
          {PRESET_ICONS.map(em => (
            <button
              key={em}
              className={`icon-btn ${icon === em ? 'icon-btn--active' : ''}`}
              onClick={() => setIcon(em)}
            >
              {em}
            </button>
          ))}
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
