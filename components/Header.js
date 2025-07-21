// Header component ka code hai. Isme logo aur checkout button hai.
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link href="/">
          <Image src={logo} alt="Logo" width={100} height={50} />
        </Link>
      </div>
      <div className="checkout">
        <Link href="/checkout">Checkout</Link>
      </div>
    </header>
  );
};

export default Header;