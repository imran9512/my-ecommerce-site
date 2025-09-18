// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_SEARCH_CONSOLE_TAG, SITE_URL } from '../data/constants.js';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-scroll-behavior="smooth">
        <Head>
          <meta name="robots" content="index,follow" />
          {/* Google Search Console */}
          <meta
            name="google-site-verification"
            content={GOOGLE_SEARCH_CONSOLE_TAG.match(/content="([^"]+)"/)[1]}
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