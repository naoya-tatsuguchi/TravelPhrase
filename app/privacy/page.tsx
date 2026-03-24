import Link from 'next/link';

export const metadata = {
  title: 'プライバシーポリシー | TravelPhrase — 自分で作る旅行単語帳',
  description: 'TravelPhrase — 自分で作る旅行単語帳 のプライバシーポリシー',
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link href="/" className="privacy-back">
          ← TravelPhrase — 自分で作る旅行単語帳 に戻る
        </Link>
      </header>

      <main className="privacy-main">
        <h1>プライバシーポリシー</h1>
        <p className="privacy-updated">最終更新日: 2025年2月</p>

        <section>
          <h2>1. はじめに</h2>
          <p>
            TravelPhrase — 自分で作る旅行単語帳（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の適切な取り扱いを行います。
            本プライバシーポリシーは、本アプリが収集・利用する情報と、その目的について説明します。
          </p>
        </section>

        <section>
          <h2>2. 収集する情報</h2>
          <h3>2.1 アカウント情報（ログイン時）</h3>
          <p>
            本アプリは Supabase Authentication により、以下の情報を取得します。
          </p>
          <ul>
            <li>メールアドレス</li>
            <li>認証に必要なトークン（セッション管理用）</li>
          </ul>

          <h3>2.2 ユーザーデータ（ログイン時）</h3>
          <p>
            ログインユーザーが作成したフレーズ（言語・カテゴリ・フレーズ本文など）は、
            Supabase のクラウドデータベースに保存されます。
          </p>

          <h3>2.3 ローカル保存</h3>
          <p>
            未ログイン時およびオフライン利用時は、IndexedDB 等を利用してブラウザ内に一時的にデータを保存する場合があります。
          </p>
        </section>

        <section>
          <h2>3. 第三者サービスの利用</h2>
          <p>本アプリは、以下の第三者サービスを利用しています。</p>
          <ul>
            <li>
              <strong>Supabase</strong>：認証・データベース（ユーザーデータの保存）
            </li>
            <li>
              <strong>Anthropic Claude API</strong>：翻訳・カタカナ読み生成（AI 翻訳機能利用時のみ）
            </li>
            <li>
              <strong>Google AdSense</strong>：広告配信（第三者配信事業者による広告表示）
            </li>
          </ul>
          <p>
            これらのサービスは、それぞれのプライバシーポリシーに従ってデータを処理します。
          </p>
        </section>

        <section>
          <h2>3.1 広告（Google AdSense）と Cookie 等の利用</h2>
          <p>
            本アプリは、Google が提供する広告サービス（Google AdSense）を利用して広告を表示する場合があります。
            Google を含む第三者配信事業者は Cookie 等を使用し、ユーザーの過去のアクセス情報に基づいて広告を配信することがあります。
          </p>
          <p>
            広告配信で使用される情報や設定の詳細は、Google の案内をご確認ください。
          </p>
        </section>

        <section>
          <h2>4. 情報の利用目的</h2>
          <ul>
            <li>アカウント認証とセッション管理</li>
            <li>ユーザーが作成したフレーズの保存・同期</li>
            <li>翻訳とカタカナ読みの生成（ユーザーが AI 翻訳を利用した場合）</li>
            <li>アプリの動作・機能の提供</li>
          </ul>
        </section>

        <section>
          <h2>5. データの共有</h2>
          <p>
            本アプリは、法的要請がない限り、ユーザーの個人情報を第三者に販売または共有しません。
            上記の第三者サービスへの送信は、アプリの機能提供に必要な範囲に限ります。
          </p>
        </section>

        <section>
          <h2>6. データの削除</h2>
          <p>
            アカウント削除をご希望の場合は、Supabase の管理画面、またはアプリ提供者までご連絡ください。
            合理的な範囲で速やかに対応いたします。
          </p>
        </section>

        <section>
          <h2>7. セキュリティ</h2>
          <p>
            通信は HTTPS を利用し、認証情報およびデータの安全な送受信に努めています。
          </p>
        </section>

        <section>
          <h2>8. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、アプリ提供者までご連絡ください。
          </p>
        </section>
      </main>
    </div>
  );
}
