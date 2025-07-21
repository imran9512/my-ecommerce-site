// Footer component ka code hai. Isme main menu, search, help, aur cart options hai.
const Footer = () => {
  return (
    <footer className="footer">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/cart">Cart</a></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;