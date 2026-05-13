"use client";

import { useState } from "react";

const faqs = [
  { q: "How do I wash my Malvie tee?", a: "Machine wash cold inside out with similar colors. Tumble dry low or hang dry. Do not bleach." },
  { q: "What fabrics do you use?", a: "We use 100% combed ring-spun cotton (240 GSM) for all tees. Accessories vary – see product descriptions." },
  { q: "Do you ship internationally?", a: "Currently we only ship within Sri Lanka. International shipping coming soon!" },
  { q: "Can I change my order after placing it?", a: "Please contact us within 2 hours of ordering at hello@malvie.lk. We'll try our best to accommodate." },
  { q: "Do you have a physical store?", a: "Malvie is currently online-only. We pop up at select markets – follow our Instagram for updates." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="info-page-wrap">
      <h1 className="info-page-title" style={{ marginBottom: "40px" }}>Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <div key={idx} style={{ marginBottom: "16px", borderBottom: "0.5px solid var(--light-border)", paddingBottom: "16px" }}>
          <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", fontSize: "18px", fontWeight: "500", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {faq.q}
            <span style={{ fontSize: "24px" }}>{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && <p style={{ marginTop: "12px", color: "var(--mid-gray)", paddingLeft: "12px" }}>{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}