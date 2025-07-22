// components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/outline'; // ✅ verified import
import logo from '../public/logo.png';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md h-20 flex items-center justify-between px-6">
      <Link href="/">
        <Image src={logo} alt="Logo" width={120} height={48} className="object-contain" />
      </Link>

      <Link href="/checkout" className="flex items-center gap-1 text-sky-600 hover:text-sky-700">
        <ShoppingCartIcon className="w-6 h-6" />
        <span className="text-sm font-semibold">Cart</span>
      </Link>
    </header>
  );
}