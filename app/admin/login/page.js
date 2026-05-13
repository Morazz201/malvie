"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToastMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminAuthenticated", "true");
        setToastMsg("✅ Login successful! Redirecting...");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        setToastMsg(data.error || "❌ Invalid password. Try again.");
      }
    } catch (error) {
      setToastMsg("❌ Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--soft-pastel) 0%, var(--lavender) 100%)",
        padding: "20px",
      }}>
        <div style={{
          background: "white",
          padding: "48px",
          borderRadius: "2px",
          boxShadow: "0 4px 30px rgba(74,29,122,0.08)",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "42px",
            fontWeight: "300",
            fontStyle: "italic",
            color: "var(--deep-violet)",
            marginBottom: "8px",
          }}>Malvie</div>
          <p style={{ fontSize: "13px", color: "var(--mid-gray)", marginBottom: "32px", letterSpacing: "0.1em" }}>ADMIN ACCESS</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "24px",
                border: "0.5px solid var(--light-border)",
                fontFamily: "inherit",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: "100%", cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ fontSize: "12px", color: "var(--mid-gray)", marginTop: "24px" }}>
            Only authorized personnel can access this area.
          </p>
        </div>
      </div>
    </>
  );
}