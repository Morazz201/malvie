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
      <div className="info-page-wrap">
        <h1 className="info-page-title">Contact Us</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          <div>
            <h2 className="info-section-title">Get in Touch</h2>
            <p style={{ marginBottom: "8px" }}>📧 <a href="mailto:hello@malvie.lk" className="info-link">hello@malvie.lk</a></p>
            <p>📞 +94 77 123 4567 (Mon-Fri, 10am-6pm)</p>
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "12px" }}>Follow Us</h3>
              <a href="https://instagram.com/malvie.lk" target="_blank" className="info-link" style={{ marginRight: "16px" }}>Instagram</a>
              <a href="#" className="info-link">TikTok</a>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
            <input type="email" name="email" placeholder="Your email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
            <textarea name="message" placeholder="Your message" required rows="5" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }}></textarea>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </>
  );
}