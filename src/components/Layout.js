// src/components/Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageFooter from '@/components/PageFooter';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="mt-6 mb-6">{children}</main>
      <PageFooter />
      <Footer />
    </div>
  );
};

export default Layout;