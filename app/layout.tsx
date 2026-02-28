import './globals.css';

export const metadata = {
  title: 'TravelPhrase — 多言語旅行フレーズ',
  description: 'オフライン対応の多言語旅行フレーズアプリ。AI翻訳・音声再生付き。',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TravelPhrase',
  },
  icons: {
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
