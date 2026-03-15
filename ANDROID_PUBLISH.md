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

---

## 新しいPCで公開・更新する場合

以前のPCで作成したアプリを、新しいPCから Google Play に公開（または更新）するときに必要なものです。

### 必須：新しいPCに用意するもの

| 項目 | 説明 |
|------|------|
| **1. アプリのソースコード** | このリポジトリ（TravelPhrase）を新しいPCにクローンまたはコピー |
| **2. 環境変数** | `.env.local`（または `.env.example` を元に作成）。`ANTHROPIC_API_KEY`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定 |
| **3. 開発環境** | Node.js 18+、Java JDK 11、Android Studio（または Android SDK）、Bubblewrap CLI（後述） |
| **4. 署名キー（既にPlayで公開済みの場合）** | **重要** 以前のPCで TWA 用に作成した `android.keystore` と、キーストア・キーのパスワード。これがないと**同じアプリの更新**ができません |
| **5. TWA プロジェクト（推奨）** | 以前のPCの `android-twa` フォルダ一式。持っていれば新しいPCにコピーして `bubblewrap build` するだけで済みます |
| **6. Google Play 開発者アカウント** | 同じGoogleアカウントで [Play Console](https://play.google.com/console) にログインできること |

### 初めて公開する場合（まだPlayに出していない）

1. 新しいPCに **Node.js** と **Java JDK 11**、**Android Studio（または Android SDK）** をインストール
2. このプロジェクトで `npm install` を実行
3. `.env.local` を用意し、APIキー・Supabase を設定
4. PWA を Vercel などにデプロイし、HTTPS の URL を確保
5. `bubblewrap init` で TWA プロジェクトを新規作成（その際に **android.keystore が生成される**）
6. **android.keystore とパスワードは必ずバックアップ**（USB・クラウドなど）
7. `bubblewrap build` で AAB を生成し、Play Console から「新規アプリ」として提出

### 既にPlayで公開済みで、新しいPCから更新する場合

1. **署名キー（android.keystore）** を以前のPCからコピーする  
   - キーがないと、同じパッケージ名では「更新」として提出できません
2. **TWA プロジェクト（android-twa フォルダ）** を以前のPCからコピーする  
   - 中に `android.keystore` と `twa-manifest.json` 等が入っている想定
3. 新しいPCに Node / Java / Android SDK / Bubblewrap をインストール
4. PWA の変更があればデプロイし、同じURLのままにする
5. `android-twa` で `bubblewrap update`（必要なら）→ `bubblewrap build`
6. 生成した AAB を Play Console の「本番」で新バージョンとしてアップロード

### 署名キーを紛失した場合

- **同じアプリとしての更新はできません。** Google Play は同じ署名キーを要求します。
- 選択肢は次のどちらかです：
  - **新規アプリとして公開**：新しいパッケージ名で `bubblewrap init` し直し、新しいキーで別アプリとして登録（既存のストアのアプリは更新不可のまま）
  - 以前のPCがまだ使える場合は、そこから **android.keystore とパスワードを必ずエクスポート** する

### 新しいPCでの環境セットアップ（まとめ）

```bash
# 1. リポジトリと依存関係
git clone <あなたのリポジトリURL>
cd travel-phrase-app   # または TravelPhrase
npm install

# 2. 環境変数
cp .env.example .env.local
# .env.local を編集して API キー等を設定

# 3. Bubblewrap（TWA 用）
npm install -g @bubblewrap/cli

# 4. 環境確認
java -version          # 11 以上
bubblewrap doctor      # 問題なく通ること
```

このあと、上記の「初めて公開する場合」または「既にPlayで公開済みで更新する場合」の手順に進んでください。

---

## 初回公開：新PCでインストールから提出までの手順

以前のPCで「ステップ4: AAB をビルド」まで完了しており、**まだ Play には一度も公開していない**場合の、新PCでの作業を最初から順にまとめています。

---

### 手順1: 新PCに開発環境をインストール

| ソフト | 入手先・確認 |
|--------|----------------|
| **Node.js 18 以上** | [nodejs.org](https://nodejs.org/) から LTS をインストール。ターミナルで `node -v` と `npm -v` が表示されれば OK。 |
| **Java JDK 11** | [Adoptium](https://adoptium.net/) などで JDK 11 をインストール。`java -version` で 11 以上と表示されれば OK。 |
| **Android Studio** | [developer.android.com/studio](https://developer.android.com/studio) からインストール。インストール時に「Android SDK」も入れる。後で Bubblewrap が SDK のパスを参照する。 |
| **Bubblewrap CLI** | 手順3のプロジェクトフォルダで作業する前に、後述のコマンドでインストール。 |

---

### 手順2: プロジェクトを新PCに用意する

1. TravelPhrase のフォルダを新PCに用意する（Git でクローン、または USB などでコピー）。
2. そのフォルダでターミナルを開き、次を実行:

   ```bash
   npm install
   ```

3. 環境変数ファイルを作成:
   - `.env.example` をコピーして `.env.local` を作成。
   - 以下を設定（以前のPCで使っていた値や、Anthropic / Supabase のダッシュボードで確認）:
     - `ANTHROPIC_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 手順3: PWA のデプロイ先を確認する

- **すでに Vercel などにデプロイ済み**  
  → その HTTPS の URL をメモ（例: `https://travelphrase.vercel.app`）。手順5で使います。
- **まだデプロイしていない**  
  → [Vercel](https://vercel.com) にサインアップし、このリポジトリを GitHub と連携してデプロイ。環境変数（上記3つ）を Vercel の「Environment Variables」に登録し、デプロイ後に URL をメモ。

**確認**: ブラウザで `https://あなたのURL/manifest.json` を開き、JSON が表示されること、および `/icon-192x192.png` と `/icon-512x512.png` が表示されることを確認。

---

### 手順4: AAB を用意する（どちらか一方）

#### パターンA: 以前のPCから AAB と TWA をコピーできる場合

1. 以前のPCの **android-twa** フォルダ一式を新PCにコピー（中に `android.keystore` と `twa-manifest.json` などが入っている想定）。
2. 新PCに **Bubblewrap** と **Java / Android SDK** を入れる（手順1）。
3. ターミナルで:
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap doctor
   ```
   `bubblewrap doctor` でエラーが出ないことを確認。
4. コピーした **android-twa** フォルダに移動して AAB をビルド:
   ```bash
   cd android-twa
   bubblewrap build
   ```
5. 生成された `app-release-bundle.aab` を手順6でアップロード。

※ 今後も同じアプリを更新するため、**android.keystore とパスワードは必ずバックアップ**してください。

#### パターンB: 以前のPCのファイルが使えない場合（新PCで一から TWA を作る）

1. 手順1・2を完了していること。手順3の **デプロイ済み PWA の URL** を用意。
2. Bubblewrap をインストールし、環境を確認:
   ```bash
   npm install -g @bubblewrap/cli
   java -version
   bubblewrap doctor
   ```
3. TWA 用のフォルダを作り、初期化（URL は手順3でメモしたものに置き換え）:
   ```bash
   mkdir android-twa
   cd android-twa
   bubblewrap init --manifest https://あなたのドメイン/manifest.json
   ```
4. 対話では、ANDROID_PUBLISH.md の「ステップ3」の表（Package name, App name, Theme color など）に従って入力。**署名キーは「新規作成」**、キーストアのパスは `./android.keystore`、パスワードは必ずメモ。
5. AAB をビルド:
   ```bash
   bubblewrap build
   ```
6. 生成された `app-release-bundle.aab` を手順6でアップロード。**android.keystore とパスワードは必ずバックアップ**。

---

### 手順5: Google Play 開発者アカウントとアプリ作成

1. [Google Play Console](https://play.google.com/console) にアクセス。
2. 開発者登録料 **$25** を支払い、開発者アカウントを有効化（未登録の場合）。
3. **「アプリを作成」** をクリック。
4. アプリ名（例: TravelPhrase）、デフォルト言語、アプリ/ゲームの種別を選択して作成。

---

### 手順6: ダッシュボードの必須項目を完了する

Play Console の該当アプリのダッシュボードで、以下を順に完了します。

| 項目 | 内容 |
|------|------|
| **アプリのアクセス** | ログインが任意なら「一部の機能でログイン」など適切な選択。 |
| **プライバシーポリシー** | `https://あなたのドメイン/privacy` を登録（必須）。 |
| **アプリのアクセス権** | 使用している権限の説明を入力。 |
| **ストアの掲載情報** | アプリ名・短い説明（80文字以内）・詳細説明（4000文字以内）・スクリーンショット（スマホ2枚以上）・アイコン 512x512・必要ならフィーチャー画像 1024x500。 |

---

### 手順7: 本番リリースで AAB を提出する

1. 左メニュー **「リリース」** → **「本番」** を開く。
2. **「新しいリリースを作成」** をクリック。
3. **「アプリバンドルをアップロード」** で、手順4で用意した **app-release-bundle.aab** を選択。
4. **リリース名**（例: 1.0.0）と **リリースノート**（新機能・変更点など）を入力。
5. **「レビューに送信」** をクリック。

---

### 手順8: 審査待ちと公開

- 初回審査は数日〜1週間程度かかることがあります。
- 問題があれば Play Console のメールで連絡が届くので、指示に従って修正・再提出します。
- 承認されると、本番トラックにリリースされ、ストアに公開されます。

---

### 初回公開のチェックリスト（新PC）

- [ ] Node.js / Java JDK 11 / Android Studio（または SDK）/ Bubblewrap をインストール
- [ ] プロジェクトで `npm install` と `.env.local` の設定
- [ ] PWA を HTTPS でデプロイし、`manifest.json` とアイコンが表示されることを確認
- [ ] AAB を用意（以前のPCからコピーしてビルド、または新PCで TWA を新規作成してビルド）
- [ ] android.keystore とパスワードをバックアップ
- [ ] Play Console で開発者アカウント・アプリ作成
- [ ] プライバシーポリシー・ストア掲載情報を入力
- [ ] 本番リリースで AAB をアップロードしてレビューに送信
