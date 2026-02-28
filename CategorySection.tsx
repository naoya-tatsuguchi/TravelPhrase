'use client';

import { useState } from 'react';
import type { Category, Language } from '@/types/phrase';
import type { Phrase } from '@/types/phrase';
import { useAppStore } from '@/store/phraseStore';
import { PhraseCard } from '@/components/phrase/PhraseCard';
import { PhraseModal } from '@/components/phrase/PhraseModal';

interface Props {
  language: Language;
  category: Category;
}

export function CategorySection({ language, category }: Props) {
  const deleteCategory = useAppStore(s => s.deleteCategory);
  const updateCategory = useAppStore(s => s.updateCategory);

  const [open,        setOpen]        = useState(true);
  const [addPhrase,   setAddPhrase]   = useState(false);
  const [editPhrase,  setEditPhrase]  = useState<Phrase | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal,     setNameVal]     = useState(category.name);

  const handleRename = () => {
    if (nameVal.trim()) updateCategory(language.id, category.id, { name: nameVal.trim() });
    setEditingName(false);
  };

  const handleDelete = () => {
    if (confirm(`カテゴリー「${category.name}」を削除しますか？（フレーズも全て削除されます）`)) {
      deleteCategory(language.id, category.id);
    }
  };

  return (
    <section className="category-section">
      {/* Header */}
      <div className="category-header" onClick={() => setOpen(v => !v)}>
        <span className="category-icon">{category.icon}</span>
        {editingName ? (
          <input
            className="field-input category-name-input"
            value={nameVal}
            onClick={e => e.stopPropagation()}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => e.key === 'Enter' && handleRename()}
            autoFocus
          />
        ) : (
          <span className="category-name">{category.name}</span>
        )}
        <span className="category-count">{category.phrases.length}フレーズ</span>

        <div className="category-menu" onClick={e => e.stopPropagation()}>
          <button className="btn-icon" onClick={() => setEditingName(true)} title="名前を変更">✏️</button>
          <button className="btn-icon btn-icon--danger" onClick={handleDelete} title="削除">🗑️</button>
        </div>
        <span className="category-chevron">{open ? '▲' : '▼'}</span>
      </div>

      {/* Phrase list */}
      {open && (
        <div className="category-body">
          <div className="phrase-grid">
            {category.phrases.map(phrase => (
              <PhraseCard
                key={phrase.id}
                phrase={phrase}
                category={category}
                language={language}
                onEdit={() => setEditPhrase(phrase)}
              />
            ))}
          </div>

          <button
            className="btn-add-phrase"
            onClick={() => setAddPhrase(true)}
          >
            ＋ フレーズを追加
          </button>
        </div>
      )}

      {/* Modals */}
      {addPhrase && (
        <PhraseModal
          language={language}
          category={category}
          onClose={() => setAddPhrase(false)}
        />
      )}
      {editPhrase && (
        <PhraseModal
          language={language}
          category={category}
          phrase={editPhrase}
          onClose={() => setEditPhrase(null)}
        />
      )}
    </section>
  );
}
