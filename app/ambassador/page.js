"use client";
import { useState } from "react";
import Toast from "@/components/Toast";

export default function Ambassador() {
  const [toastMsg, setToastMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", instagram: "", why: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMsg("✨ Thanks for your interest! We'll reach out within a week.");
    setForm({ name: "", email: "", instagram: "", why: "" });
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div style={{ padding: "140px 40px 80px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "52px", fontWeight: "300", fontStyle: "italic", marginBottom: "16px" }}>Become a Malvie Ambassador</h1>
        <p style={{ color: "var(--mid-gray)", marginBottom: "40px" }}>Love Malvie? Join our ambassador program and receive exclusive perks, free products, and a community of like‑minded girls.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)" }} />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)" }} />
          <input type="text" name="instagram" placeholder="Instagram handle" required value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)" }} />
          <textarea name="why" placeholder="Why do you want to be a Malvie ambassador?" rows="4" required value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} style={{ width: "100%", padding: "12px", marginBottom: "16px", border: "0.5px solid var(--light-border)" }}></textarea>
          <button type="submit" className="btn-primary">Apply Now</button>
        </form>
      </div>
    </>
  );
}