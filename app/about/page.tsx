import Link from 'next/link';

export const metadata = {
  title: '運営 | TravelPhrase — 自分で作る旅行単語帳',
  description: 'TravelPhrase の運営情報とお問い合わせについて',
};

export default function AboutPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link href="/" className="privacy-back">
          ← トップへ戻る
        </Link>
      </header>

      <main className="privacy-main">
        <h1>運営</h1>
        <p className="privacy-updated">TravelPhrase は、旅行中に役立つ多言語フレーズ帳を提供するアプリです。</p>

        <section>
          <h2>サービスの概要</h2>
          <p>
            TravelPhrase — 自分で作る旅行単語帳は、旅行で使うフレーズを「自分用」に整理して、必要なときにすぐ表示できるようにすることを目指しています。
            フレーズを拡大表示する機能により、言葉に自信がない場面でも「見せて伝える」体験を支援します。
          </p>
        </section>

        <section>
          <h2>AI翻訳について</h2>
          <p>
            フレーズ作成時に、必要に応じてAI翻訳（翻訳補助）をご利用いただけます。
            ただし翻訳結果は参考情報のため、実際に使う表現に合わせて編集してください。
          </p>
        </section>

        <section>
          <h2>お問い合わせ</h2>
          <p>
            本アプリに関するお問い合わせは、プライバシーポリシーの内容をご確認ください：<Link href="/privacy">/privacy</Link>
          </p>
        </section>

        <section>
          <h2>広告について</h2>
          <p>
            本アプリは Google AdSense を利用している場合があります。広告の表示可否や配信内容は、配信状況や審査状況によって変わることがあります。
          </p>
        </section>
      </main>
    </div>
  );
}

