"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function Header() {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <div className="header-inner">
          <Link href="/" className="logo">Malvie<span></span></Link>
          <nav>
            <Link href="/shop">Shop</Link>
            <Link href="/our-story">Our Story</Link>
            <Link href="/community">Community</Link>
          </nav>
          <div className="header-right">
            <a href="https://instagram.com/shopmalvie" className="ig-handle" target="_blank">@shopmalvie</a>
            <Link href="/cart" className="cart-btn">
              🛍
              <span className="cart-count">{cartCount}</span>
            </Link>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 999, opacity: 1, transition: "opacity 0.3s ease" }}></div>
          <div className="mobile-nav open">
            <button className="mobile-nav-close" onClick={() => setMobileOpen(false)}>✕</button>
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/our-story" onClick={() => setMobileOpen(false)}>Our Story</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)}>Community</Link>
            <Link href="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
          </div>
        </>
      )}
    </>
  );
}