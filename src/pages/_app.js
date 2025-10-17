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

    {/*if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
    }*/}
  }, []);

  return (
    <>
      <Head>
        {/* Google Search Console tag */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;