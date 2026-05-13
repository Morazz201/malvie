export default function Shipping() {
  return (
    <div style={{ padding: "140px 40px 80px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "52px", fontWeight: "300", fontStyle: "italic", marginBottom: "24px" }}>Shipping Information</h1>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Delivery Time</h2>
        <p>Orders are processed within 1-2 business days. Delivery typically takes 3-5 business days island-wide (Sri Lanka).</p>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Shipping Rates</h2>
        <p>Standard shipping: LKR 500 (free for orders over LKR 5,000).</p>
        <p>Express shipping: LKR 800 (2-3 business days).</p>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Tracking</h2>
        <p>Once your order ships, you will receive a tracking link via email and SMS.</p>
      </div>
    </div>
  );
}