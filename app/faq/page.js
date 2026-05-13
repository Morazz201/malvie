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
    <div className="info-page">
      <h1 className="info-title" style={{ marginBottom: "40px" }}>Frequently Asked Questions</h1>
    <div className="info-page-wrap">
      <h1 className="info-page-title" style={{ marginBottom: "40px" }}>Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <div key={idx} className="faq-item">
          <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="faq-question">
            {faq.q}
            <span className="faq-icon">{openIndex === idx ? "−" : "+"}</span>
          </button>
          {openIndex === idx && <p className="faq-answer">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
