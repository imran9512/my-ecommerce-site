// _app.js mein layout component ko wrap karte hain.
import { appWithTranslation } from 'next-i18next';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(MyApp);