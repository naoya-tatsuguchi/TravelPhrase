'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/phraseStore';
import { loadStore } from '@/lib/db';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import { CategorySection } from '@/components/category/CategorySection';
import { CategoryModal } from '@/components/category/CategoryModal';
import { LanguageModal } from '@/components/language/LanguageModal';
import { SearchResults } from '@/components/search/SearchResults';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { VoiceHelpModal } from '@/components/layout/VoiceHelpModal';
import { AuthModal } from '@/components/auth/AuthModal';

export default function Home() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { languages, activeLanguageId, searchQuery, isLoaded, init, setActiveLanguage,
          setSearchQuery, deleteLanguage, setUserId } = useAppStore();

  const [showAddLang, setShowAddLang] = useState(false);
  const [showAddCat,  setShowAddCat]  = useState(false);
  const [showAuth,    setShowAuth]    = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  const searchResults = useSearch(languages, searchQuery);
  const isSearching   = searchQuery.trim().length > 0;
  const activeLang    = languages.find(l => l.id === activeLanguageId);
  const [showInitialHints, setShowInitialHints] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const userId = user?.id ?? null;
    setUserId(userId);
    loadStore(userId).then(store => init(store.languages));
  }, [user, authLoading, init, setUserId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setShowInitialHints(true);
      return;
    }
    const key = `tp_initial_hints_${user.id}`;
    const seen = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    if (!seen) {
      setShowInitialHints(true);
      window.localStorage.setItem(key, '1');
    } else {
      setShowInitialHints(false);
    }
  }, [user, authLoading]);

  if (!isLoaded || authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>データを読み込み中…</p>
      </div>
    );
  }

  return (
    <>
      <OfflineBanner />

      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            <span className="app-title-icon">🌏</span>
            TravelPhrase — 自分で作る旅行単語帳
          </h1>

          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="フレーズを検索…"
              aria-label="フレーズ検索"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="header-auth">
            {user ? (
              <div className="auth-user">
                <span className="auth-email" title={user.email ?? ''}>
                  {user.email?.split('@')[0] ?? 'ユーザー'}
                </span>
                <button
                  type="button"
                  className="btn-auth btn-auth--logout"
                  onClick={() => signOut()}
                  title="ログアウト"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn-auth"
                onClick={() => setShowAuth(true)}
                title="ログイン"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Language Tabs ─── */}
      <nav className="lang-tabs" role="tablist">
        <div className="lang-tabs-inner">
          {languages.map(lang => (
            <div key={lang.id} className="lang-tab-wrap">
              <button
                role="tab"
                aria-selected={lang.id === activeLanguageId}
                className={`lang-tab ${lang.id === activeLanguageId ? 'lang-tab--active' : ''}`}
                onClick={() => setActiveLanguage(lang.id)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </button>
              {lang.id === activeLanguageId && user && (
                <button
                  className="lang-delete-btn"
                  title="この言語を削除"
                  onClick={() => confirm(`「${lang.name}」を削除しますか？`) && deleteLanguage(lang.id)}
                >✕</button>
              )}
            </div>
          ))}
          <button
            className="lang-add-btn"
            onClick={() => user ? setShowAddLang(true) : setShowAuth(true)}
            title={user ? '言語を追加' : 'ログインして言語を追加'}
          >
            ＋ 言語
          </button>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="app-main">
        {isSearching ? (
          <SearchResults results={searchResults} />
        ) : activeLang ? (
          <>
            {!user && (
              <div className="guest-banner" role="status">
                <span>サンプルデータを閲覧中。ログインするとオリジナルのフレーズ集を作成できます。</span>
                <button
                  type="button"
                  className="guest-banner-btn"
                  onClick={() => setShowAuth(true)}
                >
                  ログイン
                </button>
              </div>
            )}

            <section className="home-intro" aria-label="アプリの説明">
              <h2 className="home-intro-title">旅行先で「見せて伝わる」自分の単語帳</h2>
              <p className="home-intro-desc">
                英語・韓国語・タイ語など、複数の言語を追加して自分専用のフレーズ帳を作れます。
              </p>
              <ul className="home-intro-list">
                <li>フレーズをタップして拡大表示（相手に見せる用途に最適）</li>
                <li>▶ボタンでフレーズを音声再生し、発音の確認やその場で聞かせることもできます</li>
                <li>AI翻訳でフレーズ作成を補助（必要なときだけ）</li>
              </ul>
              <div className="home-intro-actions">
                <Link href="/guide" className="home-intro-link">
                  使い方を見る
                </Link>
              </div>
            </section>

            <div className="lang-hero">
              <span className="lang-hero-flag">{activeLang.flag}</span>
              <div>
                <h2 className="lang-hero-name">{activeLang.name}</h2>
                <p className="lang-hero-native">{activeLang.nativeName}</p>
              </div>
              <span className="lang-hero-count">
                {activeLang.categories.reduce((n, c) => n + c.phrases.length, 0)} フレーズ
              </span>
            </div>

            {activeLang.categories.map((cat, i) => (
              <CategorySection
                key={cat.id}
                language={activeLang}
                category={cat}
                isLoggedIn={!!user}
                onLoginRequest={() => setShowAuth(true)}
                defaultOpen={showInitialHints && i === 0}
                defaultExpandNotes={showInitialHints && i === 0}
              />
            ))}

            {activeLang.categories.length === 0 && (
              <div className="empty-state">
                <p>カテゴリーがまだありません。</p>
                {!user && <p className="auth-prompt">ログインするとカテゴリーを追加できます。</p>}
              </div>
            )}

            <button
              className="btn-add-category"
              onClick={() => user ? setShowAddCat(true) : setShowAuth(true)}
              title={user ? 'カテゴリーを追加' : 'ログインしてカテゴリーを追加'}
            >
              ＋ カテゴリーを追加
            </button>
          </>
        ) : (
          <div className="empty-state">
            <p>言語を追加してはじめましょう。</p>
            {!user && (
              <p className="auth-prompt">
                ログインすると、オリジナルのフレーズ集を作成できます。
              </p>
            )}
            <div className="empty-state-actions">
              <button
                className="btn-primary"
                onClick={() => user ? setShowAddLang(true) : setShowAuth(true)}
              >
                ＋ 言語を追加
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ─── Modals ─── */}
      {showAuth && (
        <AuthModal
          mode="signin"
          onClose={() => setShowAuth(false)}
          onSignIn={signIn}
          onSignUp={signUp}
        />
      )}
      {showAddLang && <LanguageModal onClose={() => setShowAddLang(false)} />}
      {showAddCat && activeLang && (
        <CategoryModal languageId={activeLang.id} onClose={() => setShowAddCat(false)} />
      )}

      <footer className="app-footer">
        <button
          type="button"
          className="footer-link footer-link-btn footer-link-voice"
          onClick={() => setShowVoiceHelp(true)}
        >
          🔊 音声のネイティブ発音設定（Android）
        </button>
        <a href="/guide" className="footer-link">使い方</a>
        <a href="/faq" className="footer-link">よくある質問</a>
        <a href="/about" className="footer-link">運営</a>
        <a href="/privacy" className="footer-link">プライバシーポリシー</a>
      </footer>

      {showVoiceHelp && (
        <VoiceHelpModal onClose={() => setShowVoiceHelp(false)} />
      )}
    </>
  );
}
