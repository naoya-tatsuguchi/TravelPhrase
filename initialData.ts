import type { Language } from '@/types/phrase';

const now = Date.now();

const id = (prefix: string, i: number) => `${prefix}-${i}`;

export const INITIAL_LANGUAGES: Language[] = [
  {
    id: 'lang-en',
    name: '英語',
    nativeName: 'English',
    bcp47: 'en-US',
    flag: '🇺🇸',
    createdAt: now,
    updatedAt: now,
    categories: [
      {
        id: 'en-cat-1',
        name: '挨拶',
        icon: '👋',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('en-p',1), jaText: 'こんにちは', targetText: 'Hello',           katakana: 'ハ・ロー',                    notes: '最も一般的な挨拶。',           createdAt: now, updatedAt: now },
          { id: id('en-p',2), jaText: 'ありがとう', targetText: 'Thank you',        katakana: 'サン・キュー',                 notes: 'カジュアル〜フォーマルまで使える。', createdAt: now, updatedAt: now },
          { id: id('en-p',3), jaText: 'すみません', targetText: 'Excuse me',        katakana: 'エク・スキュー・ズ・ミー',       notes: '人に話しかける時や道を開けてもらう時に使う。', createdAt: now, updatedAt: now },
          { id: id('en-p',4), jaText: 'さようなら', targetText: 'Goodbye',          katakana: 'グッ・バイ',                  notes: 'もう少しカジュアルに "See you!" も使われる。', createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'en-cat-2',
        name: 'お金・買い物',
        icon: '🛍️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('en-p',5), jaText: 'いくらですか',     targetText: 'How much is this?',    katakana: 'ハウ・マッチ・イズ・ディス',   notes: '商品を指差しながら使う。',                          createdAt: now, updatedAt: now },
          { id: id('en-p',6), jaText: '高すぎます',       targetText: 'That\'s too expensive', katakana: 'ザッツ・トゥー・イクスペンシブ', notes: '値交渉の場面で。',                                createdAt: now, updatedAt: now },
          { id: id('en-p',7), jaText: 'これをください',    targetText: 'I\'ll take this',       katakana: 'アイル・テイク・ディス',       notes: '購入を決めた時。',                                 createdAt: now, updatedAt: now },
          { id: id('en-p',8), jaText: 'カードは使えますか', targetText: 'Do you accept cards?',  katakana: 'ドゥユー・アクセプト・カーズ',  notes: 'クレジットカード払い可否の確認。',                     createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'en-cat-3',
        name: '緊急・助けを求める',
        icon: '🆘',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('en-p',9),  jaText: '助けてください', targetText: 'Help me, please!', katakana: 'ヘルプ・ミー・プリーズ',  notes: '緊急時に大きな声で。',            createdAt: now, updatedAt: now },
          { id: id('en-p',10), jaText: '病院はどこですか', targetText: 'Where is the hospital?', katakana: 'ウェア・イズ・ザ・ホスピタル', notes: '医療機関を探す時。',              createdAt: now, updatedAt: now },
        ],
      },
    ],
  },
  {
    id: 'lang-ko',
    name: '韓国語',
    nativeName: '한국어',
    bcp47: 'ko-KR',
    flag: '🇰🇷',
    createdAt: now,
    updatedAt: now,
    categories: [
      {
        id: 'ko-cat-1',
        name: '挨拶',
        icon: '👋',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('ko-p',1), jaText: 'こんにちは',    targetText: '안녕하세요',      katakana: 'アン・ニョン・ハ・セヨ',  notes: '丁寧な挨拶。朝昼夜共通で使える。',        createdAt: now, updatedAt: now },
          { id: id('ko-p',2), jaText: 'ありがとう',    targetText: '감사합니다',      katakana: 'カム・サ・ハム・ニダ',   notes: '最も丁寧なお礼の表現。',                  createdAt: now, updatedAt: now },
          { id: id('ko-p',3), jaText: 'すみません',    targetText: '실례합니다',      katakana: 'シル・レ・ハム・ニダ',   notes: '人に話しかける時の丁寧表現。',             createdAt: now, updatedAt: now },
          { id: id('ko-p',4), jaText: 'さようなら',    targetText: '안녕히 가세요',   katakana: 'アン・ニョン・ヒ・カ・セヨ', notes: '去る人に対して「気をつけて」という意味。', createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'ko-cat-2',
        name: 'お金・買い物',
        icon: '🛍️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('ko-p',5), jaText: 'いくらですか',     targetText: '얼마예요?',       katakana: 'オル・マ・エ・ヨ',         notes: 'カジュアルな値段確認。',              createdAt: now, updatedAt: now },
          { id: id('ko-p',6), jaText: 'これをください',    targetText: '이것 주세요',     katakana: 'イ・ゴッ・チュ・セヨ',     notes: '指差して注文や購入に使える万能表現。',  createdAt: now, updatedAt: now },
          { id: id('ko-p',7), jaText: '値引きできますか', targetText: '깎아 주세요',     katakana: 'ッカッカ・チュ・セヨ',     notes: '市場や交渉可能な店での値引き依頼。',   createdAt: now, updatedAt: now },
          { id: id('ko-p',8), jaText: 'カードは使えますか', targetText: '카드 돼요?',    katakana: 'カード・トェ・ヨ',         notes: 'カジュアルなカード払い可否確認。',     createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'ko-cat-3',
        name: 'レストラン',
        icon: '🍽️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('ko-p',9),  jaText: 'おすすめは何ですか', targetText: '추천이 뭐예요?', katakana: 'チュ・チョニ・モ・エ・ヨ', notes: '店員に一番人気を聞く表現。',         createdAt: now, updatedAt: now },
          { id: id('ko-p',10), jaText: '辛くしないでください', targetText: '안 맵게 해주세요', katakana: 'アン・メプッケ・ヘ・チュ・セヨ', notes: '辛さ調整の依頼。',               createdAt: now, updatedAt: now },
        ],
      },
    ],
  },
  {
    id: 'lang-th',
    name: 'タイ語',
    nativeName: 'ภาษาไทย',
    bcp47: 'th-TH',
    flag: '🇹🇭',
    createdAt: now,
    updatedAt: now,
    categories: [
      {
        id: 'th-cat-1',
        name: '挨拶',
        icon: '👋',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('th-p',1), jaText: 'こんにちは',  targetText: 'สวัสดีครับ / ค่ะ', katakana: 'サ・ワッ・ディー・クラップ／カ', notes: '男性は「クラップ」、女性は「カ」を使う。', createdAt: now, updatedAt: now },
          { id: id('th-p',2), jaText: 'ありがとう',  targetText: 'ขอบคุณครับ / ค่ะ', katakana: 'コープ・クン・クラップ／カ',    notes: 'こちらも男女で語尾が変わる。',             createdAt: now, updatedAt: now },
          { id: id('th-p',3), jaText: 'すみません',  targetText: 'ขอโทษครับ / ค่ะ',  katakana: 'コー・トート・クラップ／カ',   notes: '謝罪・呼びかけ両方に使える。',             createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'th-cat-2',
        name: 'お金・買い物',
        icon: '🛍️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('th-p',4), jaText: 'いくらですか',   targetText: 'ราคาเท่าไหร่ครับ / ค่ะ', katakana: 'ラーカー・タウライ・クラップ／カ', notes: '値段を聞く基本表現。',             createdAt: now, updatedAt: now },
          { id: id('th-p',5), jaText: '高すぎます',     targetText: 'แพงเกินไปครับ / ค่ะ',     katakana: 'ペーン・ゴーン・パイ・クラップ／カ', notes: '値引き交渉の入り口として使う。',  createdAt: now, updatedAt: now },
          { id: id('th-p',6), jaText: 'これをください', targetText: 'เอาอันนี้ครับ / ค่ะ',      katakana: 'アオ・アン・ニー・クラップ／カ',    notes: '指差しながら使う購入表現。',       createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'th-cat-3',
        name: 'トランスポート',
        icon: '🚕',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('th-p',7), jaText: '〜へ行ってください', targetText: 'ไปที่...ครับ / ค่ะ',   katakana: 'パイ・ティー・...・クラップ／カ', notes: '行き先を「...」部分に言う。タクシーで必須。', createdAt: now, updatedAt: now },
          { id: id('th-p',8), jaText: 'ここで止めてください', targetText: 'จอดตรงนี้ครับ / ค่ะ', katakana: 'チョート・トロン・ニー・クラップ／カ', notes: '目的地付近で使う下車依頼。',                  createdAt: now, updatedAt: now },
        ],
      },
    ],
  },
];
