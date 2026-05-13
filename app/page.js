"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Toast from "@/components/Toast";
import { products } from "@/lib/products";

export default function Home() {
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const featured = products.slice(0, 4);

  // Re-run reveal observer after page load (already done in layout, but we keep for safety)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.add("visible"));
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setToastMsg(`✨ ${product.name} added to cart`);
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      
      {/* Hero */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-bg"></div>
        <div className="hero-noise"></div>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">Bloom Collection · Issue 01</div>
            <h1 className="hero-heading">Wear<br />Your <em>Story</em></h1>
            <p className="hero-sub">Soft luxury fashion, intentionally crafted for the modern Sri Lankan woman. Aesthetic. Elevated. Authentically yours.</p>
            <div className="hero-ctas">
              <Link href="/shop" className="btn-primary">Shop the Bloom Collection</Link>
              <Link href="/our-story" className="btn-ghost">Our Story →</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-main">
              <div className="hero-logo-display">Malvie</div>
              <div className="hero-card-tag">Bloom · Issue 01</div>
            </div>
            <div className="hero-float-badge" aria-hidden="true">New<br />Drop<br />2024</div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <span className="scroll-line"></span>
          <span>Scroll</span>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-inner">
          <span className="marquee-item"><span className="star">✦</span> New Collection</span>
          <span className="marquee-item"><span className="star">✦</span> Wear Your Story</span>
          <span className="marquee-item"><span className="star">✦</span> Ships Island-Wide</span>
          <span className="marquee-item"><span className="star">✦</span> Soft Luxury Fashion</span>
          <span className="marquee-item"><span className="star">✦</span> Bloom — Issue 01</span>
          <span className="marquee-item"><span className="star">✦</span> Est. 2024 · Sri Lanka</span>
          {/* duplicate for seamless loop */}
          <span className="marquee-item"><span className="star">✦</span> New Collection</span>
          <span className="marquee-item"><span className="star">✦</span> Wear Your Story</span>
          <span className="marquee-item"><span className="star">✦</span> Ships Island-Wide</span>
          <span className="marquee-item"><span className="star">✦</span> Soft Luxury Fashion</span>
          <span className="marquee-item"><span className="star">✦</span> Bloom — Issue 01</span>
          <span className="marquee-item"><span className="star">✦</span> Est. 2024 · Sri Lanka</span>
        </div>
      </div>

      {/* Featured Collection */}
      <section id="collection" className="section-wrap">
        <div className="section-inner">
          <div className="collection-header">
            <div>
              <div className="section-label reveal">The Collection</div>
              <h2 className="section-heading reveal reveal-delay-1">Bloom —<br /><em style={{ fontFamily: "inherit", fontStyle: "italic" }}>Issue 01</em></h2>
            </div>
            <Link href="/shop" className="btn-ghost reveal reveal-delay-2">View All Pieces →</Link>
          </div>
          <div className="product-grid">
            {featured.map((product, idx) => (
              <div key={product.id} className={`product-card reveal reveal-delay-${idx+1}`}>
                <div className="product-img-wrap">
                  <div className="product-img" style={{ background: "linear-gradient(145deg, var(--lavender), var(--lilac))" }}>
                    <span style={{ fontSize: "48px" }}>{product.icon}</span>
                  </div>
                  <div className="product-overlay">
                    <button className="quick-add" onClick={() => handleAdd(product)}>+ Add to Cart</button>
                  </div>
                  {product.badge && <div className="product-badge">{product.badge}</div>}
                </div>
                <div className="product-name">{product.name}</div>
                <div className="product-tagline">{product.tagline}</div>
                <div className="product-price-row">
                  <span className="product-price">LKR {product.price.toLocaleString()}</span>
                  <div className="product-colors">
                    {product.colors.map((c, i) => <div key={i} className="color-dot" style={{ background: c }}></div>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="collection-footer">
            <span className="collection-footer-text">Available in XS – XL · All pieces 240 GSM cotton</span>
            <Link href="/size-guide" className="collection-footer-link">View Size Guide →</Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="story-wrap">
        <div className="story-grid">
          <div className="story-visual" aria-hidden="true">
            <div className="story-visual-content">
              <span className="story-visual-word">Bloom</span>
              <div className="story-visual-logo">Malvie</div>
              <div className="story-visual-sub">Est. 2024 · Sri Lanka</div>
            </div>
          </div>
          <div className="story-text-side">
            <div className="section-label reveal">Our Story</div>
            <h2 className="section-heading reveal reveal-delay-1">Crafted with<br />intention.</h2>
            <p className="section-sub reveal reveal-delay-2">Malvie was born from a simple belief — that fashion should feel as beautiful as it looks. That young Sri Lankan women deserve a brand that truly speaks their language.</p>
            <p style={{ fontSize: "14px", color: "var(--mid-gray)", lineHeight: "1.85", fontWeight: "300" }} className="reveal reveal-delay-2">We create soft-luxe, aesthetic fashion that sits at the intersection of Korean minimalism and feminine elegance. Every stitch, print, and package is chosen with care — because we believe the details are what make something unforgettable.</p>
            <div className="story-values reveal reveal-delay-3">
              <div className="value-item"><div className="value-title">Affordable Luxury</div><div className="value-desc">Premium feel without the premium price. Fashion that empowers.</div></div>
              <div className="value-item"><div className="value-title">Aesthetic Intent</div><div className="value-desc">Every piece is curated, never generic. Beauty in every detail.</div></div>
              <div className="value-item"><div className="value-title">Community First</div><div className="value-desc">You're not just a customer — you're a Malvie Girl.</div></div>
              <div className="value-item"><div className="value-title">Conscious Style</div><div className="value-desc">Quality over quantity, always. Made to be worn and loved.</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging */}
      <section className="packaging-wrap">
        <div className="packaging-inner">
          <div style={{ maxWidth: "520px" }}>
            <div className="section-label">The Experience</div>
            <h2 className="section-heading" style={{ color: "white" }}>The Malvie<br />Unboxing.</h2>
            <p className="section-sub">Every order arrives like a gift from a luxury boutique. Because we believe the packaging is part of the product.</p>
          </div>
          <div className="packaging-grid">
            <div className="pack-card reveal"><span className="pack-icon">🪻</span><div className="pack-title">Matte Lilac Mailer</div><div className="pack-body">Dusty lilac poly mailer with a white Malvie logo stamp. Minimal, elegant.</div></div>
            <div className="pack-card reveal reveal-delay-1"><span className="pack-icon">🤍</span><div className="pack-title">Tissue & Seal</div><div className="pack-body">Soft lavender tissue paper wrapped around your order, sealed with a premium Malvie sticker.</div></div>
            <div className="pack-card reveal reveal-delay-2"><span className="pack-icon">✉️</span><div className="pack-title">Handwritten Note</div><div className="pack-body">A thick matte thank-you card in handwritten-style script.</div></div>
            <div className="pack-card reveal reveal-delay-3"><span className="pack-icon">🏷️</span><div className="pack-title">Cream Hang Tags</div><div className="pack-body">350gsm matte kraft tags with the Malvie logo, tied with a satin ribbon.</div></div>
            <div className="pack-card reveal reveal-delay-4"><span className="pack-icon">🌿</span><div className="pack-title">Lavender Sachet</div><div className="pack-body">A light lavender sachet nestled inside every order. Sensory luxury.</div></div>
            <div className="pack-card reveal"><span className="pack-icon">✨</span><div className="pack-title">Sticker Surprise</div><div className="pack-body">A small Malvie sticker sheet tucked in — low cost, high delight.</div></div>
          </div>
        </div>
      </section>

      {/* Community / Instagram */}
      <section id="community" className="section-wrap">
        <div className="section-inner">
          <div className="community-heading-wrap">
            <div className="section-label reveal">Instagram</div>
            <h2 className="section-heading reveal reveal-delay-1">The Malvie Girls</h2>
            <p className="section-sub reveal reveal-delay-2" style={{ margin: "0 auto", textAlign: "center" }}>Real girls, real outfits. Join our community and get featured.</p>
          </div>
          <div className="community-grid">
            <div className="ig-card reveal"><div className="ig-bg" style={{ background: "linear-gradient(145deg, #E8DEFF, #C4A8E8)" }}><span style={{ fontSize: "32px" }}>✦</span></div><div className="ig-overlay"><div className="ig-overlay-text"><div style={{ fontSize: "18px", marginBottom: "4px" }}>♡ 342</div><div>@anika.style</div></div></div></div>
            <div className="ig-card reveal reveal-delay-1"><div className="ig-bg" style={{ background: "linear-gradient(145deg, #4A1D7A, #8B6BAF)" }}><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>Malvie</div></div><div className="ig-overlay"><div className="ig-overlay-text"><div style={{ fontSize: "18px", marginBottom: "4px" }}>♡ 518</div><div>@dew.drops.lk</div></div></div></div>
            <div className="ig-card reveal reveal-delay-2"><div className="ig-bg" style={{ background: "linear-gradient(145deg, #FDFAF5, #F0E8FF)" }}><div style={{ fontSize: "40px", color: "var(--orchid)" }}>✿</div><div style={{ fontSize: "12px", letterSpacing: "0.2em", color: "var(--dusty-plum)", textTransform: "uppercase", marginTop: "6px" }}>OOTD</div></div><div className="ig-overlay"><div className="ig-overlay-text"><div style={{ fontSize: "18px", marginBottom: "4px" }}>♡ 287</div><div>@soft.aesthetics_</div></div></div></div>
            <div className="ig-card reveal reveal-delay-3"><div className="ig-bg" style={{ background: "linear-gradient(145deg, #B47DC8, #C4A8E8, #E8DEFF)" }}><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "white", opacity: 0.9 }}>"Wear Your Story"</div></div><div className="ig-overlay"><div className="ig-overlay-text"><div style={{ fontSize: "18px", marginBottom: "4px" }}>♡ 401</div><div>@nuwan.captures</div></div></div></div>
          </div>
          <div className="community-cta reveal">
            <div className="community-hashtag">#MalvieGirl</div>
            <p className="community-note">Tag <a href="https://instagram.com/shopmalvie" target="_blank" style={{ color: "var(--orchid)", textDecoration: "none", fontWeight: "500" }}>@malvie.lk</a> and use <strong style={{ color: "var(--deep-violet)" }}>#MalvieGirl</strong> to be featured on our page</p>
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="email-strip">
        <div className="email-strip-inner">
          <div className="email-eyebrow">Early Access</div>
          <h2 className="email-heading">Get first access<br /><em>to every drop.</em></h2>
          <p className="email-sub">Join the Malvie Girls community. Be first for new collections, exclusive offers & behind-the-scenes drops.</p>
          <form className="email-form" onSubmit={(e) => { e.preventDefault(); setToastMsg("✨ Welcome to the Malvie Girls community!"); e.target.reset(); }}>
            <input className="email-input" type="email" placeholder="your@email.com" required />
            <button className="email-submit" type="submit">Join</button>
          </form>
        </div>
      </section>
    </>
  );
}