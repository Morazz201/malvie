import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "200px 40px", textAlign: "center" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "120px", fontWeight: "300", color: "var(--deep-violet)", marginBottom: "20px" }}>404</h1>
      <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "32px", fontWeight: "300", fontStyle: "italic" }}>Page Not Found</h2>
      <p style={{ marginBottom: "40px" }}>Oops! It seems like you've wandered off the Malvie path.</p>
      <Link href="/" className="btn-primary">Return Home</Link>
    </div>
  );
}