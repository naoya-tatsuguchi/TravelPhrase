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
          { id: id('en-p',1), jaText: 'すみません、道に迷いました', targetText: 'Excuse me, I\'m lost.', katakana: 'エクスキューズ・ミー、アイム・ロスト', notes: '道を尋ねる前の一言。', createdAt: now, updatedAt: now },
          { id: id('en-p',2), jaText: '〜へ行きたいです', targetText: 'I\'d like to go to ...', katakana: 'アィド・ライク・トゥ・ゴー・トゥ…', notes: '行き先を「…」に入れて使う。', createdAt: now, updatedAt: now },
          { id: id('en-p',3), jaText: 'これをください', targetText: 'I\'ll take this.', katakana: 'アイル・テイク・ディス', notes: 'お店で指差ししながら使える。', createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'en-cat-2',
        name: 'お金・買い物',
        icon: '🛍️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('en-p',5), jaText: 'いくらですか？', targetText: 'How much is this?', katakana: 'ハウ・マッチ・イズ・ディス', notes: '商品を指差しながら聞く。', createdAt: now, updatedAt: now },
          { id: id('en-p',7), jaText: 'カードは使えますか？', targetText: 'Do you accept cards?', katakana: 'ドゥ・ユー・アクセプト・カーズ', notes: 'カード払い可否の確認。', createdAt: now, updatedAt: now },
          { id: id('en-p',6), jaText: 'レシートをください', targetText: 'Can I get a receipt?', katakana: 'キャン・アイ・ゲット・ア・レシート', notes: '経費や返品のために。', createdAt: now, updatedAt: now },
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
          { id: id('ko-p',1), jaText: 'すみません（呼びかけ）', targetText: '저기요', katakana: 'チョギヨ', notes: '店員さんや人を呼び止める時に便利。', createdAt: now, updatedAt: now },
          { id: id('ko-p',2), jaText: 'これをください', targetText: '이것 주세요', katakana: 'イゴッ・チュセヨ', notes: '指差ししながら使える万能表現。', createdAt: now, updatedAt: now },
          { id: id('ko-p',3), jaText: '英語は話せますか？', targetText: '영어 할 수 있어요?', katakana: 'ヨンオ・ハル・ス・イッソヨ', notes: '会話が難しい時の確認。', createdAt: now, updatedAt: now },
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
          { id: id('ko-p',7), jaText: 'レシートください', targetText: '영수증 주세요',     katakana: 'ヨンスジュン・チュセヨ',     notes: '領収書（レシート）をお願いする。',   createdAt: now, updatedAt: now },
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
    id: 'lang-fr',
    name: 'フランス語',
    nativeName: 'Français',
    bcp47: 'fr-FR',
    flag: '🇫🇷',
    createdAt: now,
    updatedAt: now,
    categories: [
      {
        id: 'fr-cat-1',
        name: '挨拶',
        icon: '👋',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('fr-p',1), jaText: 'こんにちは',  targetText: 'Bonjour',           katakana: 'ボンジュール',         notes: '最も一般的な挨拶。朝〜昼に使う。',           createdAt: now, updatedAt: now },
          { id: id('fr-p',2), jaText: 'ありがとう',  targetText: 'Merci',             katakana: 'メルシー',           notes: 'シンプルなお礼の表現。',                     createdAt: now, updatedAt: now },
          { id: id('fr-p',3), jaText: 'すみません',  targetText: 'Excusez-moi',       katakana: 'エクスキュゼ・モワ',   notes: '謝罪・呼びかけ両方に使える。',             createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'fr-cat-2',
        name: 'お金・買い物',
        icon: '🛍️',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('fr-p',4), jaText: 'いくらですか',   targetText: 'C\'est combien ?',   katakana: 'セ・コンビアン',       notes: '値段を聞く基本表現。',             createdAt: now, updatedAt: now },
          { id: id('fr-p',5), jaText: '高すぎます',     targetText: 'C\'est trop cher',  katakana: 'セ・トロ・シェール',     notes: '値引き交渉の入り口として使う。',  createdAt: now, updatedAt: now },
          { id: id('fr-p',6), jaText: 'これをください', targetText: 'Je voudrais ceci', katakana: 'ジュ・ヴドレ・スシ',     notes: '指差しながら使う購入表現。',       createdAt: now, updatedAt: now },
        ],
      },
      {
        id: 'fr-cat-3',
        name: 'トランスポート',
        icon: '🚕',
        createdAt: now,
        updatedAt: now,
        phrases: [
          { id: id('fr-p',7), jaText: '〜へ行ってください', targetText: 'À ..., s\'il vous plaît', katakana: 'ア・...・シル・ヴ・プレ', notes: '行き先を「...」部分に言う。タクシーで必須。', createdAt: now, updatedAt: now },
          { id: id('fr-p',8), jaText: 'ここで止めてください', targetText: 'Arrêtez ici, s\'il vous plaît', katakana: 'アレテ・イシ・シル・ヴ・プレ', notes: '目的地付近で使う下車依頼。',                  createdAt: now, updatedAt: now },
        ],
      },
    ],
  },
];
