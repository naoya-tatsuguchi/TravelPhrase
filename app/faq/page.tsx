import Link from 'next/link';

export const metadata = {
  title: 'よくある質問 | TravelPhrase — 自分で作る旅行単語帳',
  description: 'TravelPhrase のよくある質問（音声・AI翻訳・オフライン・ログイン）',
};

export default function FaqPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link href="/" className="privacy-back">
          ← トップへ戻る
        </Link>
      </header>

      <main className="privacy-main">
        <h1>よくある質問</h1>
        <p className="privacy-updated">旅行中に困りやすいポイントを、短く分かりやすくまとめています。</p>

        <section>
          <h2>Q1. フレーズをタップすると拡大表示できません</h2>
          <p>
            画面操作のタイミングにより、拡大表示の挙動が変わる場合があります。
            まずはフレーズカードを「タップ」して試してください。
            それでも難しい場合は、音声ボタンや編集ボタン以外の場所をタップしてみてください。
          </p>
        </section>

        <section>
          <h2>Q2. 音声が出ない（または英語でも出ない）</h2>
          <p>
            ブラウザ標準の音声合成は、端末の音声データの有無や読み込み状況に左右されます。
            本アプリは端末依存を減らすための音声再生にも対応しています。
            まずはアプリ内の「🔊 音声のネイティブ発音設定（Android）」をご確認ください。
          </p>
        </section>

        <section>
          <h2>Q3. AI翻訳は必ず使う必要がありますか？</h2>
          <p>
            必須ではありません。AI翻訳はフレーズ作成の補助として利用できます。
            翻訳結果は参考情報なので、必要に応じてあなたの言葉に調整してください。
          </p>
        </section>

        <section>
          <h2>Q4. オフラインでも使えますか？</h2>
          <p>
            環境によってはオフライン時に表示できる場合があります。
            ただし、常に完全なオフライン動作を保証するものではありません。
            旅行前に一度アプリを開いておくと安心です。
          </p>
        </section>

        <section>
          <h2>Q5. ログインすると何ができますか？</h2>
          <p>
            ログインすると、フレーズの保存や復元がクラウド側で行われます。
            未ログイン時はブラウザ内の一時保存で利用されることがあります。
          </p>
        </section>

        <section>
          <h2>Q6. 広告は表示されますか？</h2>
          <p>
            本アプリは広告（Google AdSense）を利用している場合があります。
            広告の表示可否は、配信状況や審査状況によって変わることがあります。
          </p>
        </section>

        <section>
          <h2>Q7. データの扱いはどこで確認できますか？</h2>
          <p>
            プライバシーポリシーをご確認ください：<Link href="/privacy">/privacy</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

