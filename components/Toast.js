"use client";
import { useEffect } from "react";

export default function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), 2800);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px",
      background: "var(--deep-violet)", color: "white",
      padding: "14px 24px", fontSize: "13px", letterSpacing: "0.05em",
      transform: "translateY(0)", opacity: 1,
      transition: "transform 0.35s ease, opacity 0.35s ease",
      zIndex: 999, fontFamily: "'DM Sans', sans-serif",
      borderLeft: "3px solid var(--lilac)", maxWidth: "280px"
    }}>
      {message}
    </div>
  );
}