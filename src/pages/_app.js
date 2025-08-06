// src/pages/_app.js
import Layout from '../components/Layout';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  /* load cart on first mount */
  useEffect(() => {
    useCartStore.getState().load?.();
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <>
        {/* Google Search Console tag */}
        <Head>
          <meta
            name="google-site-verification"
            content="YOUR_VERIFICATION_CODE"
          />
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    </SessionProvider>
  );
}

export default MyApp;