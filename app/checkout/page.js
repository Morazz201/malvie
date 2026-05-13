"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import Toast from "@/components/Toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  // Redirect if cart empty
  if (cart.length === 0) {
    return (
      <div className="empty-checkout" style={{ padding: "160px 40px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ fontSize: "80px", marginBottom: "24px" }}>🛒</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "36px", fontStyle: "italic", marginBottom: "16px" }}>Your cart is empty</h2>
        <p style={{ marginBottom: "32px", color: "var(--mid-gray)" }}>Add some beautiful pieces before checking out.</p>
        <Link href="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "radio" ? value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMsg("✨ Processing your order...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          cart: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || "M",
            icon: item.icon,
          })),
          totals: { subtotal, shipping, tax, total },
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToastMsg("✅ Order placed successfully! Check your email for confirmation.");
        clearCart();
        // Redirect to home after 2.5 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else {
        setToastMsg(data.error || "❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setToastMsg("❌ Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div style={{ padding: "140px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "48px", fontWeight: "300", fontStyle: "italic", marginBottom: "40px" }}>Checkout</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "50px" }}>
          {/* Billing Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: "white", border: "0.5px solid var(--light-border)", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "22px", fontWeight: "300", marginBottom: "24px", paddingBottom: "12px", borderBottom: "0.5px solid var(--light-border)" }}>Billing Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} style={{ width: "100%", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
                </div>
              </div>
            </div>

            <div style={{ background: "white", border: "0.5px solid var(--light-border)", padding: "32px" }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "22px", fontWeight: "300", marginBottom: "24px", paddingBottom: "12px", borderBottom: "0.5px solid var(--light-border)" }}>Payment Method</h2>
              <div className="payment-options">
                <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>Credit / Debit Card (coming soon)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", cursor: "pointer" }}>
                  <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === "bank"} onChange={handleChange} />
                  <span>Bank Transfer (coming soon)</span>
                </label>
              </div>
            </div>

            {/* Submit button inside form so Enter key works */}
            <div style={{ marginTop: "24px" }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: "100%", background: isSubmitting ? "var(--mid-gray)" : "var(--deep-violet)" }}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="order-summary-title">Your Order</div>
            {cart.map((item, idx) => (
              <div key={idx} className="order-summary-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="order-summary-totals">
              <div className="order-summary-row">
                <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="order-summary-row">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="order-summary-row">
                <span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="order-summary-total-row">
                <span>Total</span><span className="order-summary-total-val">LKR {total.toLocaleString()}</span>
              </div>
            </div>
            <p className="order-summary-terms">
              By placing an order, you agree to our <Link href="/terms" className="order-summary-link">Terms</Link> and <Link href="/privacy" className="order-summary-link">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}