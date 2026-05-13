"use client";
import { useState } from "react";
import Link from "next/link";
import Toast from "@/components/Toast";

export default function CommunityPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", instagram: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setToastMsg("✨ Thanks for reaching out! We'll be in touch soon.");
      setFormData({ name: "", email: "", instagram: "", message: "" });
    } catch (error) {
      console.error('Submission error:', error);
      setToastMsg("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div className="community-page">
        {/* Hero Section */}
        <section className="community-hero">
          <div className="community-hero-inner">
            <h1>The Malvie Community</h1>
            <p>Where style meets sisterhood. Share your Malvie looks, get inspired, and be part of something beautiful.</p>
          </div>
        </section>

        {/* Instagram Feed (Mockup) */}
        <section className="community-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">#MalvieGirl</span>
              <h2>Follow Our Journey</h2>
              <p>Real girls, real style. Tag us to be featured.</p>
            </div>
            <div className="instagram-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="ig-card">
                  <div className="ig-image" style={{ background: `linear-gradient(135deg, var(--lavender), var(--lilac))` }}>
                    <div className="ig-overlay">
                      <span>✨</span>
                      <span>@malvie.lk</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="community-cta">
              <a href="https://instagram.com/shopmalvie" target="_blank" className="btn-primary">Follow @shopmalvie</a>
              <p className="hashtag">#MalvieGirl #WearYourStory</p>
            </div>
          </div>
        </section>

        {/* Ambassador Program */}
        <section className="ambassador-section">
          <div className="container ambassador-grid">
            <div className="ambassador-content">
              <span className="section-label">Join the family</span>
              <h2>Become a Malvie Ambassador</h2>
              <p>Love Malvie? Share your passion and get exclusive perks: free products, early access, commission, and a community of like‑minded girls.</p>
              <Link href="/ambassador" className="btn-primary">Apply Now →</Link>
            </div>
            <div className="ambassador-stats">
              <div className="stat"><span>500+</span><p>Active Ambassadors</p></div>
              <div className="stat"><span>10K+</span><p>Community Posts</p></div>
              <div className="stat"><span>✨</span><p>Monthly Meetups</p></div>
            </div>
          </div>
        </section>

        {/* Community Gallery (User Submissions) */}
        <section className="community-section">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Our Tribe</span>
              <h2>Real Malvie Girls</h2>
              <p>Tag your photos with #MalvieGirl – you might be featured here!</p>
            </div>
            <div className="gallery-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="gallery-item" style={{ background: `linear-gradient(145deg, var(--soft-pastel), var(--lavender))` }}>
                  <div className="gallery-overlay">
                    <span>📸</span>
                    <span>@malvie.lk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connect & Share Form */}
        <section className="connect-section">
          <div className="container connect-grid">
            <div className="connect-text">
              <h2>Share Your Story</h2>
              <p>Got a question, a styling tip, or just want to say hi? We’d love to hear from you.</p>
              <ul className="connect-list">
                <li>✨ Get featured on our socials</li>
                <li>💌 Exclusive community updates</li>
                <li>🎁 Special surprises for active members</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} className="connect-form">
              <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} required />
              <input type="text" name="instagram" placeholder="Instagram handle (optional)" value={formData.instagram} onChange={handleChange} />
              <textarea name="message" placeholder="Tell us something..." rows="4" value={formData.message} onChange={handleChange}></textarea>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Join the Community"}</button>
            </form>
          </div>
        </section>

        {/* Newsletter */}
        <section className="newsletter-strip">
          <div className="container">
            <h3>Stay in the loop</h3>
            <p>Be first to hear about drops, events, and community news.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setToastMsg("✨ You're subscribed!"); e.target.reset(); }}>
              <input type="email" placeholder="Your email" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </section>
      </div>

      <style jsx>{`
        .community-page {
          background: var(--cream);
        }
        .community-hero {
          background: linear-gradient(135deg, var(--soft-pastel) 0%, var(--lavender) 100%);
          padding: 140px 40px 80px;
          text-align: center;
        }
        .community-hero-inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .community-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 300;
          font-style: italic;
          color: var(--deep-violet);
          margin-bottom: 20px;
        }
        .community-hero p {
          font-size: 18px;
          color: var(--mid-gray);
          line-height: 1.7;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .community-section {
          padding: 80px 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .section-label {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--orchid);
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          font-style: italic;
          margin-bottom: 12px;
        }
        .section-header p {
          color: var(--mid-gray);
          max-width: 500px;
          margin: 0 auto;
        }
        .instagram-grid, .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .ig-card, .gallery-item {
          aspect-ratio: 1;
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }
        .ig-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          transition: transform 0.3s;
        }
        .ig-card:hover .ig-image {
          transform: scale(1.05);
        }
        .ig-overlay, .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(74,29,122,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s;
          color: white;
          font-size: 14px;
        }
        .ig-card:hover .ig-overlay, .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        .community-cta {
          text-align: center;
        }
        .hashtag {
          margin-top: 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-style: italic;
          color: var(--deep-violet);
        }
        .ambassador-section {
          background: linear-gradient(135deg, var(--deep-violet) 0%, var(--dusty-plum) 100%);
          color: white;
          padding: 80px 0;
        }
        .ambassador-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .ambassador-content .section-label {
          color: var(--lilac);
        }
        .ambassador-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          font-style: italic;
          margin: 16px 0;
        }
        .ambassador-content p {
          color: rgba(255,255,255,0.8);
          margin-bottom: 32px;
        }
        .ambassador-stats {
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }
        .stat {
          text-align: center;
        }
        .stat span {
          display: block;
          font-size: 42px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .stat p {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
        }
        .connect-section {
          padding: 80px 0;
          background: var(--white);
        }
        .connect-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .connect-text h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          font-style: italic;
          margin-bottom: 20px;
        }
        .connect-list {
          list-style: none;
          margin-top: 30px;
        }
        .connect-list li {
          margin-bottom: 12px;
          font-size: 16px;
          color: var(--mid-gray);
        }
        .connect-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .connect-form input, .connect-form textarea {
          padding: 14px;
          border: 0.5px solid var(--light-border);
          font-family: inherit;
          font-size: 14px;
          background: var(--cream);
        }
        .connect-form button {
          margin-top: 8px;
        }
        .newsletter-strip {
          background: var(--soft-pastel);
          padding: 60px 0;
          text-align: center;
        }
        .newsletter-strip h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          font-style: italic;
          margin-bottom: 12px;
        }
        .newsletter-form {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        .newsletter-form input {
          padding: 12px 20px;
          width: 280px;
          border: 0.5px solid var(--light-border);
          font-family: inherit;
        }
        @media (max-width: 768px) {
          .ambassador-grid, .connect-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .ambassador-stats {
            justify-content: center;
          }
          .community-hero {
            padding: 120px 20px 60px;
          }
          .community-section {
            padding: 60px 0;
          }
          .instagram-grid, .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .newsletter-form {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}