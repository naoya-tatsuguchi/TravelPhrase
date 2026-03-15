'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-boundary">
      <div className="error-boundary-inner">
        <span className="error-boundary-icon" aria-hidden>⚠️</span>
        <h1 className="error-boundary-title">エラーが発生しました</h1>
        <p className="error-boundary-desc">
          申し訳ございません。予期しないエラーが発生しました。
          ページを再読み込みするか、しばらくしてからもう一度お試しください。
        </p>
        <div className="error-boundary-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => reset()}
          >
            再試行
          </button>
          <Link href="/" className="btn-secondary error-link">
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
