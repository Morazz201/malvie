import Link from "next/link";

export default function Footer() {
  return (
    <footer role="contentinfo">
      <div className="footer-grid">
        <div>
          <div className="footer-brand-name">Malvie</div>
          <p className="footer-brand-tag">Soft luxury fashion for the<br />modern Sri Lankan woman.<br />Wear Your Story.</p>
          <div className="footer-social">
            <a href="https://instagram.com/shopmalvie" target="_blank">📸</a>
            <a href="#">🎵</a>
            <a href="#">💬</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Shop</div>
          <ul className="footer-links">
            <li><Link href="/shop">New Arrivals</Link></li>
            <li><Link href="/shop">Bloom Collection</Link></li>
            <li><Link href="/shop">Oversized Tees</Link></li>
            <li><Link href="/shop">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Help</div>
          <ul className="footer-links">
            <li><Link href="/size-guide">Size Guide</Link></li>
            <li><Link href="/shipping">Shipping Info</Link></li>
            <li><Link href="/returns">Returns & Exchanges</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Brand</div>
          <ul className="footer-links">
            <li><Link href="/our-story">Our Story</Link></li>
            <li><Link href="/community">Community</Link></li>
            <li><Link href="/ambassador">Become an Ambassador</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Malvie · Sri Lanka · All rights reserved</span>
        <div><Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Service</Link></div>
        <span>Made with ✦ in Sri Lanka</span>
      </div>
    </footer>
  );
}