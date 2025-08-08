// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_SEARCH_CONSOLE_TAG } from '../data/constants.js';   // adjust path if needed

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Google Search Console */}
          <meta
            name="google-site-verification"
            // remove the <meta ... /> wrapper and keep only the content
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