// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_SEARCH_CONSOLE_TAG } from '../data/constants.js';   // adjust path if needed
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/data/constants';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-scroll-behavior="smooth">
        <Head>
          <title>{SITE_NAME} – Empowering Wellbeing for Men & Women</title>
          <meta name="description" content={SITE_DESCRIPTION} />
          <link rel="canonical" href={SITE_URL} />
          <meta name="robots" content="index,follow" />
          
          {/* Google Search Console */}
          <meta
            name="google-site-verification"
            // remove the <meta ... /> wrapper and keep only the content
            content={GOOGLE_SEARCH_CONSOLE_TAG.match(/content="([^"]+)"/)[1]}
          />

          {/* Structured data – WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;