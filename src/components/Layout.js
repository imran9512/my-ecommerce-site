// Layout component ka code hai. Isme header aur footer include hai.
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="mb-6">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;