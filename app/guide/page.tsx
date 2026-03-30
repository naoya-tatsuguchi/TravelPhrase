import Link from 'next/link';
import { AdBanner } from '@/components/ads/AdBanner';

export const metadata = {
  title: '使い方 | TravelPhrase — 自分で作る旅行単語帳',
  description: 'TravelPhrase の基本的な使い方（フレーズ作成・検索・拡大表示・音声）',
};

export default function GuidePage() {
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MAIN ?? '';

  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link href="/" className="privacy-back">
          ← トップへ戻る
        </Link>
      </header>

      <main className="privacy-main">
        <h1>使い方</h1>
        <p className="privacy-updated">
          旅行先で「相手に見せて伝える」ための、フレーズ帳の作り方と使い方をまとめました。
        </p>

        <section>
          <h2>1. 言語とカテゴリを用意する</h2>
          <p>
            まずは、上部の言語タブから対象の言語を選びます。次に、カテゴリ（例：挨拶、お金・買い物、緊急など）を選び、
            フレーズを整理しやすい形にしておくと、旅行中の検索がとてもスムーズです。
          </p>
        </section>

        <section>
          <h2>2. フレーズを追加する</h2>
          <p>
            画面下部の「＋ フレーズを追加」から、フレーズを登録できます。日本語の意味（例：こんにちは）と、目的の言語の文章（例：Hello / その国の表現）を作成します。
          </p>
          <p>
            フレーズ作成では、必要に応じて <strong>AI翻訳</strong>（翻訳補助）を利用できます。翻訳結果は参考情報として、
            あなたが実際に使う形へ調整してください。
          </p>
        </section>

        <section>
          <h2>3. 検索してすぐに見つける</h2>
          <p>
            上部の検索ボックスに言葉を入力すると、条件に合うフレーズを素早く探せます。旅行中でも「考える前に見せる」用途に向いています。
          </p>
        </section>

        <section>
          <h2>4. フレーズをタップして拡大表示する</h2>
          <p>
            フレーズカードをタップすると、画面を拡大して表示します。これは「相手に見せる」ための機能です。
            発音や表現に自信がない場合でも、画面を見せて伝えやすくなります。
          </p>
        </section>

        <section>
          <h2>5. 音声再生について</h2>
          <p>
            ブラウザ標準の音声合成（Web Speech）だけでなく、端末によっては音声が安定しない場合があります。
            そのため、本アプリでは端末依存を減らすための音声再生（クラウド音声）を使う場合があります。
          </p>
          <p>
            詳細はアプリ内の「🔊 音声のネイティブ発音設定（Android）」をご確認ください。
          </p>
        </section>

        <section>
          <h2>6. オフラインでも使える場合があります</h2>
          <p>
            オフラインや通信が不安定な環境でも、キャッシュされたデータが利用できる場合があります。
            旅行前に一度アプリを開いて、必要な言語のデータが読み込まれているか確認するのがおすすめです。
          </p>
        </section>

        <section>
          <h2>7. データの保存と復元</h2>
          <p>
            ログインしている場合は、フレーズの保存や復元がクラウド側で行われます。
            未ログイン時は、ブラウザ内の一時保存（ローカル）で利用されることがあります。
          </p>
          <p>
            詳しくはプライバシーポリシーをご覧ください：<Link href="/privacy">/privacy</Link>
          </p>
        </section>

        {adSlot && (
          <section className="ad-section" aria-label="広告">
            <AdBanner slot={adSlot} className="ad-banner" />
          </section>
        )}
      </main>
    </div>
  );
}

