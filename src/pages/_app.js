// src/pages/_app.js
import Layout from '../components/Layout';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  /* load cart on first mount */
  useEffect(() => {
    useCartStore.getState().load?.();
  }, []);

  return (
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
  );
}

export default MyApp;