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
      <Head>
        {/* Google Search Console tag */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-BJ9QK4H14S"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-BJ9QK4H14S');
</script>

      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;