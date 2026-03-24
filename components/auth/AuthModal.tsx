'use client';

import { useState } from 'react';

interface Props {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export function AuthModal({ mode, onClose, onSignIn, onSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');

  const toJapaneseAuthError = (msg: string): string => {
    const normalized = msg.toLowerCase();
    if (normalized.includes('invalid login credentials')) return 'メールアドレスまたはパスワードが正しくありません。';
    if (normalized.includes('email not confirmed')) return 'メール確認が完了していません。確認メールのリンクを開いてください。';
    if (normalized.includes('password should be at least')) return 'パスワードは6文字以上で入力してください。';
    if (normalized.includes('too many requests')) return '試行回数が多すぎます。しばらく待ってから再試行してください。';
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'エラーが発生しました';
      if (msg === 'Supabase が設定されていません') {
        setError(
          'Supabase が設定されていません。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を追加し、開発サーバーを再起動してください。'
        );
      } else if (msg.startsWith('CONFIRM_EMAIL: ')) {
        setSuccessMsg(msg.replace('CONFIRM_EMAIL: ', ''));
      } else {
        setError(toJapaneseAuthError(msg));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2 className="modal-title">{isSignUp ? 'アカウント作成' : 'ログイン'}</h2>
        <p className="auth-modal-desc">
          {isSignUp
            ? 'メールアドレスでアカウントを作成し、フレーズをクラウドに保存できます。'
            : 'ログインして、保存したフレーズを復元します。'}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">メールアドレス</label>
          <input
            type="email"
            className="field-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            autoComplete="email"
          />

          <label className="field-label">パスワード</label>
          <input
            type="password"
            className="field-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={isSignUp ? '6文字以上' : 'パスワード'}
            required
            minLength={isSignUp ? 6 : undefined}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />

          {successMsg && <p className="field-success">{successMsg}</p>}
          {error && !successMsg && <p className="field-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '処理中…' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </div>
        </form>

        <button
          type="button"
          className="auth-modal-switch"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
        >
          {isSignUp ? 'すでにアカウントをお持ちの方 → ログイン' : 'アカウントをお持ちでない方 → 新規作成'}
        </button>
      </div>
    </div>
  );
}
