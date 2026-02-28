# 🌏 TravelPhrase — 多言語旅行フレーズアプリ

オフライン対応の多言語フレーズ管理アプリです。Claude API による自動翻訳・カタカナ読み生成機能を搭載しています。

---

## ✨ 機能一覧

| 機能 | 詳細 |
|---|---|
| 🌐 多言語サポート | 英語・韓国語・タイ語プリセット + カスタム言語追加 |
| 📚 3階層構造 | 言語 › カテゴリー › フレーズ |
| ✨ AI翻訳 | 日本語 → 翻訳 + カタカナ読み を Claude API で自動生成 |
| 🔊 音声再生 | Web Speech API によるネイティブ発音（オフライン対応） |
| 🔍 全文検索 | 日本語・外国語・カタカナを横断リアルタイム検索 |
| 📴 オフライン | PWA + IndexedDB でオフラインでも全フレーズ参照・再生可能 |
| 👤 アカウント | ログインしてカテゴリ・フレーズをクラウド保存（Supabase） |
| 💎 ルビ表示 | 外国語テキストの上にカタカナを表示 |

---

## 🚀 セットアップ

### 1. リポジトリのクローン & 依存関係インストール

```bash
git clone <repo>
cd travel-phrase-app
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集し、以下を設定:

```
# AI翻訳用
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx...

# ログイン・データ保存用（Supabase）
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

- **ANTHROPIC_API_KEY**: [Anthropic Console](https://console.anthropic.com) から取得
- **Supabase**: 下記「Supabase の設定方法」を参照

#### Supabase の設定方法（ログイン・アカウント作成で必要）

1. [Supabase](https://supabase.com) にアクセスし、**Sign in** → **New project** でプロジェクトを作成
2. プロジェクト作成後、左メニュー **Settings** → **API** を開く
3. **Project URL** をコピー → `.env.local` の `NEXT_PUBLIC_SUPABASE_URL` に貼り付け
4. **Project API keys** の **anon public** をコピー → `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY` に貼り付け
5. **開発サーバーを再起動**（`npm run dev` を一度止めて再度実行）
6. 下記「Supabase データベースのセットアップ」でテーブルを作成

#### アカウント作成がうまくいかない場合

- **「確認メールを送信しました」と表示された場合**  
  アカウントは正常に作成されています。メール内のリンクをクリックしてアカウントを有効化し、その後「ログイン」でログインしてください。
- **テスト用にメール確認を無効化したい場合**  
  Supabase ダッシュボード → **Authentication** → **Providers** → **Email** を開き、**Confirm email** をオフにすると、登録後すぐにログインできます。

### 3. Supabase データベースのセットアップ

Supabase ダッシュボードで SQL Editor を開き、`supabase/migrations/001_user_phrase_data.sql` の内容を実行してテーブルを作成します。

### 4. 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

### 5. 本番ビルド（PWA有効化）

```bash
npm run build
npm start
```

> ⚠️ PWA（Service Worker）は **本番ビルドのみ** 有効です。開発環境では無効化されています。

### 6. Android（Google Play）に公開する

ストア公開の手順は **[ANDROID_PUBLISH.md](./ANDROID_PUBLISH.md)** を参照してください。

---

## 📁 ディレクトリ構成

```
src/
├── app/
│   ├── api/translate/route.ts   # Claude API 呼び出しエンドポイント
│   ├── globals.css              # デザインシステム全体
│   ├── layout.tsx               # PWA メタタグ・フォント読み込み
│   └── page.tsx                 # メインページ
├── components/
│   ├── category/
│   │   ├── CategorySection.tsx  # アコーディオン形式のカテゴリー表示
│   │   └── CategoryModal.tsx    # カテゴリー追加モーダル
│   ├── language/
│   │   └── LanguageModal.tsx    # 言語追加モーダル（プリセット付き）
│   ├── layout/
│   │   └── OfflineBanner.tsx    # オフライン通知バナー
│   ├── phrase/
│   │   ├── PhraseCard.tsx       # ルビ表示・音声再生・編集削除
│   │   └── PhraseModal.tsx      # フレーズ追加・編集 + AI翻訳
│   └── search/
│       └── SearchResults.tsx    # 横断検索結果一覧
├── hooks/
│   ├── useOfflineStatus.ts      # オンライン/オフライン検知
│   ├── useSearch.ts             # 全文検索ロジック
│   └── useSpeech.ts             # Web Speech API ラッパー
├── lib/
│   ├── db.ts                    # IndexedDB 読み書き
│   ├── initialData.ts           # 英語・韓国語・タイ語プリセット
│   ├── translationPrompt.ts     # Claude API プロンプト定義
│   └── utils.ts                 # ID生成・タイムスタンプ
├── store/
│   └── phraseStore.ts           # Zustand グローバル状態管理
└── types/
    └── phrase.ts                # TypeScript 型定義
```

---

## 🔌 翻訳 API

### `POST /api/translate`

```json
// リクエスト
{
  "jaText": "ありがとう",
  "targetLanguage": "英語 (English)",
  "bcp47": "en-US"
}

// レスポンス
{
  "targetText": "Thank you",
  "katakana": "サン・キュー",
  "notes": "最も一般的なお礼の表現。フォーマル・カジュアル両方で使える。"
}
```

---

## 📱 PWA インストール

Chrome / Edge でアクセス後、アドレスバーの「インストール」ボタンをタップすると、ホーム画面に追加できます。

---

## 🛠️ 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3**
- **Zustand 5** — 状態管理
- **idb** — IndexedDB ラッパー
- **next-pwa** — Service Worker / PWA
- **@anthropic-ai/sdk** — Claude API
- **Web Speech API** — 音声合成（ブラウザ標準）
