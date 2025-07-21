// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <ul className="flex justify-center space-x-4">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/cart">Cart</a></li>
      </ul>
    </footer>
  );
}