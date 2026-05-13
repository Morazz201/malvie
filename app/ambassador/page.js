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
      <div className="info-page-wrap">
        <h1 className="info-page-title" style={{ marginBottom: "16px" }}>Become a Malvie Ambassador</h1>
        <p style={{ color: "var(--mid-gray)", marginBottom: "40px" }}>Love Malvie? Join our ambassador program and receive exclusive perks, free products, and a community of like‑minded girls.</p>
        <form onSubmit={handleSubmit} className="ambassador-form">
          <input type="text" name="name" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" />
          <input type="text" name="instagram" placeholder="Instagram handle" required value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="form-input" />
          <textarea name="why" placeholder="Why do you want to be a Malvie ambassador?" rows="4" required value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} className="form-input"></textarea>
          <button type="submit" className="btn-primary">Apply Now</button>
        </form>
      </div>
    </>
  );
}