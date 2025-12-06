// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { GOOGLE_SEARCH_CONSOLE_TAG } from '../data/constants.js';

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
          {/* ==================== Google Analytics (GA4) ==================== */}
          {/* Part 1: gtag.js script */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-BJ9QK4H14S"
          />

          {/* Part 2: gtag config */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-BJ9QK4H14S', {
                  send_page_view: true
                });
              `,
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