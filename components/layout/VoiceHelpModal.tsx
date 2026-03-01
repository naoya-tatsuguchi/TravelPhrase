'use client';

interface Props {
  onClose: () => void;
}

export function VoiceHelpModal({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal voice-help-modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">ネイティブ発音にするには（Android）</h2>
        <p className="voice-help-intro">
          音声がカタカナ読みで再生される場合、端末にその言語の音声データが入っていない可能性があります。
          以下の手順で音声をダウンロードすると、ネイティブに近い発音で再生されます。
        </p>

        <section className="voice-help-section">
          <h3 className="voice-help-step-title">1. 設定を開く</h3>
          <p>Android の <strong>設定</strong> アプリを開きます。</p>
        </section>

        <section className="voice-help-section">
          <h3 className="voice-help-step-title">2. 音声の設定へ進む</h3>
          <p>次のいずれかの方法で「音声読み上げ」の画面を開きます。</p>
          <ul className="voice-help-list">
            <li><strong>方法A:</strong> 「一般管理」→「言語と入力」→「音声読み上げ」</li>
            <li><strong>方法B:</strong> 「システム」→「言語と入力」→「音声読み上げ」</li>
            <li><strong>方法C:</strong> 設定の検索で「音声読み上げ」と入力し、該当項目をタップ</li>
          </ul>
          <p className="voice-help-note">※ 端末や Android のバージョンにより、項目名が異なる場合があります。</p>
        </section>

        <section className="voice-help-section">
          <h3 className="voice-help-step-title">3. 音声データをインストール</h3>
          <p>「音声読み上げ」の画面で、次のいずれかをタップします。</p>
          <ul className="voice-help-list">
            <li>「音声データのインストール」</li>
            <li>「音声エンジン」</li>
            <li>「Google の音声合成」</li>
          </ul>
          <p>言語一覧が表示されたら、使いたい言語（例：<strong>英語 (米国)</strong>）をタップし、<strong>「ダウンロード」</strong> または <strong>「インストール」</strong> をタップします。</p>
          <p className="voice-help-note">※ Wi‑Fi 接続でのダウンロードを推奨します（データ量が大きい場合があります）。</p>
        </section>

        <section className="voice-help-section">
          <h3 className="voice-help-step-title">4. アプリを再起動</h3>
          <p>ダウンロードが完了したら、このアプリを一度終了し、もう一度起動し直してください。新しい音声で再生されるようになります。</p>
        </section>

        <section className="voice-help-section voice-help-others">
          <h3 className="voice-help-step-title">補足</h3>
          <ul className="voice-help-list">
            <li>音声の種類やダウンロード方法は、機種・Android バージョンにより異なります。</li>
            <li>iPhone では、ブラウザの仕様により言語ごとの音声切り替えに制限がある場合があります。</li>
          </ul>
        </section>

        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
