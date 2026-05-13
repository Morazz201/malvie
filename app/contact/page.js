"use client";
import { useState } from "react";
import Toast from "@/components/Toast";

export default function Contact() {
  const [toastMsg, setToastMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMsg("✨ Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div style={{ padding: "140px 40px 80px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "52px", fontWeight: "300", fontStyle: "italic", marginBottom: "24px" }}>Contact Us</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Get in Touch</h2>
            <p style={{ marginBottom: "8px" }}>📧 <a href="mailto:hello@malvie.lk" style={{ color: "var(--orchid)" }}>hello@malvie.lk</a></p>
            <p>📞 +94 77 123 4567 (Mon-Fri, 10am-6pm)</p>
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px" }}>Follow Us</h3>
              <a href="https://instagram.com/malvie.lk" target="_blank" style={{ marginRight: "16px", color: "var(--orchid)" }}>Instagram</a>
              <a href="#" style={{ color: "var(--orchid)" }}>TikTok</a>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            <input type="text" name="name" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" />
            <input type="email" name="email" placeholder="Your email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" />
            <textarea name="message" placeholder="Your message" required rows="5" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="form-input"></textarea>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
}