'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/phraseStore';

const PRESETS = [
  { name: 'フランス語', nativeName: 'Français',   bcp47: 'fr-FR', flag: '🇫🇷' },
  { name: 'スペイン語', nativeName: 'Español',    bcp47: 'es-ES', flag: '🇪🇸' },
  { name: 'ドイツ語',   nativeName: 'Deutsch',    bcp47: 'de-DE', flag: '🇩🇪' },
  { name: 'イタリア語', nativeName: 'Italiano',   bcp47: 'it-IT', flag: '🇮🇹' },
  { name: 'ポルトガル語', nativeName: 'Português', bcp47: 'pt-BR', flag: '🇧🇷' },
  { name: 'ベトナム語',  nativeName: 'Tiếng Việt', bcp47: 'vi-VN', flag: '🇻🇳' },
  { name: '中国語（簡体字）', nativeName: '中文',  bcp47: 'zh-CN', flag: '🇨🇳' },
];

interface Props { onClose: () => void; }

export function LanguageModal({ onClose }: Props) {
  const addLanguage = useAppStore(s => s.addLanguage);
  const [name,       setName]       = useState('');
  const [nativeName, setNativeName] = useState('');
  const [bcp47,      setBcp47]      = useState('');
  const [flag,       setFlag]       = useState('🏳️');
  const [error,      setError]      = useState('');

  const applyPreset = (p: typeof PRESETS[0]) => {
    setName(p.name); setNativeName(p.nativeName);
    setBcp47(p.bcp47); setFlag(p.flag);
  };

  const handleSave = () => {
    if (!name.trim() || !nativeName.trim() || !bcp47.trim()) {
      setError('すべての必須フィールドを入力してください'); return;
    }
    addLanguage({ name, nativeName, bcp47, flag });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">言語を追加</h2>

        <p className="field-label">プリセット</p>
        <div className="preset-grid">
          {PRESETS.map(p => (
            <button key={p.bcp47} className="preset-btn" onClick={() => applyPreset(p)}>
              {p.flag} {p.name}
            </button>
          ))}
        </div>

        <div className="field-row-2">
          <div>
            <label className="field-label">国旗絵文字</label>
            <input className="field-input" value={flag} onChange={e => setFlag(e.target.value)} placeholder="🇯🇵" />
          </div>
          <div>
            <label className="field-label">言語コード (BCP-47)</label>
            <input className="field-input" value={bcp47} onChange={e => setBcp47(e.target.value)} placeholder="ja-JP" />
          </div>
        </div>

        <label className="field-label">日本語名</label>
        <input className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="例: フランス語" />

        <label className="field-label">現地語名</label>
        <input className="field-input" value={nativeName} onChange={e => setNativeName(e.target.value)} placeholder="例: Français" />

        {error && <p className="field-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-primary" onClick={handleSave}>追加</button>
        </div>
      </div>
    </div>
  );
}
