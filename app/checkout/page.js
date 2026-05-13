"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import Toast from "@/components/Toast";
import { countries } from "@/lib/countries";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    countryCode: "+94",
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
      <div className="empty-checkout">
        <div className="empty-checkout-icon">🛒</div>
        <h2 className="empty-checkout-title">Your cart is empty</h2>
        <p className="order-summary-footer" style={{ marginBottom: "32px" }}>Add some beautiful pieces before checking out.</p>
        <h2 className="empty-checkout-heading">Your cart is empty</h2>
        <p className="empty-checkout-text">Add some beautiful pieces before checking out.</p>
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

    if (!/^\d+$/.test(formData.phone) || formData.phone.length < 7 || formData.phone.length > 15) {
      setToastMsg("❌ Please enter a valid phone number (7-15 digits).");
      return;
    }

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
            phone: `${formData.countryCode} ${formData.phone}`,
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
      <div className="checkout-container">
      <div className="checkout-wrap">
        <h1 className="checkout-header">Checkout</h1>
        <h1 className="checkout-heading">Checkout</h1>
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-grid">
          {/* Billing Form */}
          <form onSubmit={handleSubmit}>
            <div className="checkout-section">
              <h2 className="checkout-section-title">Billing Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Email *</label>
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="form-input" />
                <label className="form-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
              <div style={{ marginBottom: "20px" }}>
                  <label className="checkout-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="checkout-input" />
                </div>
                <div>
                  <label className="checkout-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="checkout-input" />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Phone *</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ width: "120px", padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit", background: "white" }}>
                    {countries.map(c => (
                      <option key={c.code} value={c.dial_code}>{c.code} ({c.dial_code})</option>
                    ))}
                  </select>
                  <input type="tel" name="phone" required pattern="[0-9]{7,15}" value={formData.phone} onChange={handleChange} style={{ flex: 1, padding: "12px", border: "0.5px solid var(--light-border)", fontFamily: "inherit" }} />
                </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="checkout-input" />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="checkout-input" />
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-row">
                <div>
                  <label className="checkout-label">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="checkout-input" />
                </div>
                <div>
                  <label className="checkout-label">Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="checkout-input" />
                  <label className="form-label">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" />
                </div>
                <div>
              <div className="checkout-form-row">
                <div>
                  <label className="checkout-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="checkout-input" />
                </div>
                <div>
                  <label className="checkout-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="checkout-input" />
                </div>
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="checkout-input" />
              </div>
              <div className="checkout-form-group">
                <label className="checkout-label">Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="checkout-input" />
              </div>
              <div className="checkout-form-row">
                <div>
                  <label className="checkout-label">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="checkout-input" />
                </div>
                <div>
                  <label className="checkout-label">Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="checkout-input" />
            <div className="checkout-panel">
              <h2 className="checkout-panel-title">Billing Details</h2>
              <div className="form-row">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-row">
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "8px", color: "var(--deep-violet)" }}>Postal Code</label>
                  <label className="form-label">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Postal Code</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="form-input" />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section-title">Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option-label">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="payment-option-label">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>Credit / Debit Card (coming soon)</span>
                </label>
                <label className="payment-option-label">
              <div className="payment-options">
                <label className="payment-option-label">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="payment-option-label">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>Credit / Debit Card (coming soon)</span>
                </label>
                <label className="payment-option-label">
            <div className="checkout-panel" style={{ marginBottom: "0" }}>
              <h2 className="checkout-panel-title">Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                  <span>Cash on Delivery (COD)</span>
                </label>
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} />
                  <span>Credit / Debit Card (coming soon)</span>
                </label>
                <label className="payment-option">
                  <input type="radio" name="paymentMethod" value="bank" checked={formData.paymentMethod === "bank"} onChange={handleChange} />
                  <span>Bank Transfer (coming soon)</span>
                </label>
              </div>
            </div>

            {/* Submit button inside form so Enter key works */}
            <div className="checkout-submit-wrap">
              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: "100%", background: isSubmitting ? "var(--mid-gray)" : "var(--deep-violet)" }}>
              <button type="submit" disabled={isSubmitting} className="btn-primary checkout-submit-btn" style={{ background: isSubmitting ? "var(--mid-gray)" : "var(--deep-violet)" }}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="checkout-section-title">Your Order</div>
            {cart.map((item, idx) => (
              <div key={idx} className="order-summary-item">
          <div className="checkout-summary">
            <div className="checkout-summary-title">Your Order</div>
            {cart.map((item, idx) => (
              <div key={idx} className="checkout-summary-item">
          <div className="order-summary-box">
            <div className="order-summary-title">Your Order</div>
            {cart.map((item, idx) => (
              <div key={idx} className="order-item-row">
          <div className="checkout-summary">
            <div className="checkout-summary-title">Your Order</div>
            {cart.map((item, idx) => (
              <div key={idx} className="checkout-summary-row">
                <span>{item.name} (x{item.quantity})</span>
                <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="order-summary-details">
              <div className="order-summary-row">
                <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="order-summary-row">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="order-summary-row">
                <span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="order-summary-total">
                <span>Total</span><span className="order-summary-total-price">LKR {total.toLocaleString()}</span>
              </div>
            </div>
            <p className="order-summary-footer">
              By placing an order, you agree to our <Link href="/terms" style={{ color: "var(--orchid)" }}>Terms</Link> and <Link href="/privacy" style={{ color: "var(--orchid)" }}>Privacy Policy</Link>.
            <div className="checkout-summary-totals">
              <div className="checkout-summary-row">
                <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="checkout-summary-total-row">
                <span>Total</span><span className="checkout-summary-total-value">LKR {total.toLocaleString()}</span>
              </div>
            </div>
            <p className="checkout-terms">
              By placing an order, you agree to our <Link href="/terms" className="checkout-terms-link">Terms</Link> and <Link href="/privacy" className="checkout-terms-link">Privacy Policy</Link>.
            <div className="order-totals-section">
              <div className="order-total-row">
                <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="order-total-row">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="order-total-row">
                <span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="order-grand-total">
                <span>Total</span><span className="order-grand-total-val">LKR {total.toLocaleString()}</span>
            <div className="checkout-summary-divider">
              <div className="checkout-summary-subrow">
                <span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="checkout-summary-subrow">
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="checkout-summary-subrow">
                <span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="checkout-summary-total">
                <span>Total</span><span style={{ color: "var(--deep-violet)" }}>LKR {total.toLocaleString()}</span>
              </div>
            </div>
            <p className="order-terms">
              By placing an order, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}