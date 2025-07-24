// pages/_app.js
import Layout from '../components/Layout';
import { CartProvider } from '../contexts/CartContext';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp;