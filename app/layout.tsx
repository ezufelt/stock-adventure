import './globals.css';

export const metadata = {
  title: 'My Stock Adventure - Learn About Stocks and Money',
  description:
    'A fun way for kids to learn about stocks and investing. Track real stocks and see how money grows over time!',
  keywords:
    'kids investing, learn about stocks, money for kids, children finance, stock education',
  openGraph: {
    title: 'My Stock Adventure - Learn About Stocks and Money',
    description:
      'A fun and simple way for kids to learn about stocks, money, and investing.',
    type: 'website',
  },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self';"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'My Stock Adventure',
              description:
                'Educational platform teaching kids about stocks and investing',
              url: 'https://ezufelt.github.io/stock-adventure',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
