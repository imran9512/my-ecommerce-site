// src/pages/_app.js
import Layout from '../components/Layout';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart';

function MyApp({ Component, pageProps }) {
  // ہر صفحے پر cart لوڈ کریں (localStorage سے)
  useEffect(() => {
    useCartStore.getState().load?.();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;