export const metadata = {
  title: "{{name}}",
  description: "{{ellipsis description 150}}",
  keywords: {{{JSONstringify keywords}}},
  metadataBase: new URL('{{url}}/{{slug}}'),
  alternates: {
    canonical: '{{url}}/{{slug}}',
  },
  openGraph: {
    type: 'website',
    url: '{{url}}/{{slug}}',
    title: "{{name}}",
    description: "{{ellipsis description 150}}",
    siteName: '{{brand}}',
    images: [
    {{#each slides}}
      {
        url: '{{src}}',
        width: 1200,
        height: 630,
        alt: '{{alt}}',
      },
    {{/each}}
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "{{name}}",
    description: "{{ellipsis description 150}}",
    images: [
    {{#each slides}}
      '{{src}}',
    {{/each}}
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:type': 'product',
    'product:price:amount': '{{price}}',
    'product:price:currency': '{{currency}}',
    'product:availability': 'in stock',
    'product:brand': '{{brand}}',
  },
};

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
