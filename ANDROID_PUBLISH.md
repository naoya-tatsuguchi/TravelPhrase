# Android（Google Play）公開手順

TravelPhrase を Google Play ストアに公開するための手順です。TWA（Trusted Web Activity）で PWA を Android アプリとしてパッケージ化します。

---

## 前提条件

- Node.js 18+
- Java JDK 11（Bubblewrap 用）
- Android Studio（または Android SDK コマンドラインツール）
- Google Play 開発者アカウント（$25 登録料）

---

## 全体の流れ

1. PWA を本番環境にデプロイ
2. TWA プロジェクトを生成
3. AAB をビルド
4. Play Console でアプリ登録・提出
5. 審査後に公開

---

## ステップ1: PWA をデプロイする

まず、本アプリを HTTPS で公開する必要があります。

### 推奨: Vercel でデプロイ

1. [Vercel](https://vercel.com) にサインアップ
2. リポジトリを GitHub にプッシュして連携
3. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
4. デプロイ完了後、URL をメモ（例: `https://travelphrase.vercel.app`）

### ビルドコマンド

```bash
npm run build
```

---

## ステップ2: マニフェストを確認する

デプロイ後、以下にアクセスして JSON が返ることを確認してください。

```
https://あなたのドメイン/manifest.json
```

`/icon-192x192.png` と `/icon-512x512.png` も表示されることを確認してください。

---

## ステップ3: Bubblewrap で TWA プロジェクトを作成

### 3.1 Bubblewrap をインストール

```bash
npm install -g @bubblewrap/cli
```

### 3.2 Java と Android SDK を確認

```bash
java -version   # 11 以上
bubblewrap doctor  # 環境チェック
```

### 3.3 TWA プロジェクトを初期化

**重要**: デプロイ済みの PWA の URL が必要です。

```bash
mkdir android-twa
cd android-twa
bubblewrap init --manifest https://あなたのドメイン/manifest.json
```

対話形式で以下を入力します:

| 項目 | 推奨値 |
|------|--------|
| Package name | `com.yourdomain.travelphrase`（例） |
| App name | `TravelPhrase` |
| Launcher name | `TravelPhrase` |
| Theme color | `#0ea5e9` |
| Background color | `#f8fafc` |
| Start URL | 空欄で OK（manifest から取得） |
| Icon URL | 空欄で OK |
| Maskable icon URL | 空欄で OK |
| Shortcuts | 必要に応じて |
| Web App signing key | 新規作成を選択 |
| Key store path | `./android.keystore` |
| Key alias | `android` |
| Key passwords | 安全なパスワードを設定（忘れずメモ） |

---

## ステップ4: AAB をビルド

```bash
cd android-twa
bubblewrap build
```

成功すると `app-release-bundle.aab` が生成されます。このファイルを Play Console にアップロードします。

---

## ステップ5: Google Play Console の設定

1. [Google Play Console](https://play.google.com/console) にアクセス
2. **「アプリを作成」** をクリック
3. アプリ名「TravelPhrase」、デフォルト言語、アプリ/ゲームの種別を選択
4. **ダッシュボード** で以下を完了:

### 5.1 アプリのアクセス

- ログインが必要かどうか（任意機能なら「一部の機能でログイン」等を選択）

### 5.2 アプリのコンテンツ

- **プライバシーポリシー**: `https://あなたのドメイン/privacy` を登録（必須）
- **アプリのアクセス権**: 必要な権限を説明

### 5.3 ストアの掲載情報

- **メインのストア掲載情報**:
  - アプリ名: TravelPhrase
  - 簡単な説明（80文字以内）
  - 詳しい説明（4000文字以内）
  - スクリーンショット（スマホ 2 枚以上）
  - アイコン 512x512
  - フィーチャー画像 1024x500（任意）

### 5.4 本番リリース

1. **「本番」** → **「新しいリリースを作成」**
2. **AAB をアップロード**: `app-release-bundle.aab` を選択
3. **リリース名**（例: 1.0.0）
4. **リリースノート**（新機能・修正内容など）
5. **レビューに送信**

---

## ステップ6: 審査

- 初回は数日〜1週間程度かかることがあります
- 問題があればメールで連絡が届きます
- 承認されると自動で公開されます

---

## よくある質問

### デプロイ先が決まっていない

Vercel の無料プランで `https://プロジェクト名.vercel.app` のURLが発行されます。後からカスタムドメインに変更可能です。

### 署名キーを紛失した

再発行はできません。必ず `android.keystore` とパスワードを安全にバックアップしてください。

### アップデート手順

1. PWA をデプロイ（URL は同じ）
2. `bubblewrap update` で TWA を更新
3. 新しい AAB をビルド
4. Play Console で新バージョンとして提出

---

## チェックリスト

- [ ] PWA を HTTPS でデプロイ
- [ ] manifest.json が正しく配信される
- [ ] プライバシーポリシー URL が有効
- [ ] Bubblewrap で TWA プロジェクト作成
- [ ] AAB ビルド成功
- [ ] Play Console でアプリ登録
- [ ] プライバシーポリシー・スクリーンショット等を入力
- [ ] 本番リリースを提出
