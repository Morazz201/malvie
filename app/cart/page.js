"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Toast from "@/components/Toast";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleRemove = (id, size) => {
    removeItem(id, size);
    setToastMsg("Item removed from cart");
  };

  const handleQty = (id, size, delta) => {
    updateQuantity(id, size, delta);
  };

  if (cart.length === 0) {
    return (
      <>
        <div className="cart-wrap" style={{ padding: "140px 40px 80px", minHeight: "60vh", textAlign: "center" }}>
          <div className="empty-icon" style={{ fontSize: "80px", marginBottom: "24px" }}>🛍</div>
          <h2 className="empty-heading" style={{ fontFamily: "'Cormorant Garamond'", fontSize: "32px", fontWeight: "300", fontStyle: "italic" }}>Your Cart is Empty</h2>
          <p className="empty-sub" style={{ color: "var(--mid-gray)", marginBottom: "32px" }}>Start shopping to add items to your cart.</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div className="cart-wrap" style={{ padding: "140px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 className="cart-heading" style={{ fontFamily: "'Cormorant Garamond'", fontSize: "48px", fontWeight: "300", fontStyle: "italic", marginBottom: "40px" }}>Shopping Cart</h1>
        <div className="cart-content" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "50px" }}>
          <div className="cart-items">
            {cart.map((item, idx) => (
              <div key={idx} className="cart-item" style={{ display: "flex", gap: "24px", padding: "24px", background: "white", border: "0.5px solid var(--light-border)" }}>
                <div className="cart-item-img" style={{ width: "120px", height: "120px", background: "var(--soft-pastel)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>{item.icon}</div>
                <div className="cart-item-info" style={{ flex: 1 }}>
                  <div className="cart-item-header" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><div className="cart-item-name" style={{ fontFamily: "'Cormorant Garamond'", fontSize: "18px", fontStyle: "italic" }}>{item.name}</div><div className="cart-item-details" style={{ fontSize: "13px", color: "var(--mid-gray)" }}><span>Size: {item.size}</span></div></div>
                    <button className="cart-item-remove" onClick={() => handleRemove(item.id, item.size)} style={{ background: "none", border: "none", color: "var(--mid-gray)", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
                  </div>
                  <div className="cart-item-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                    <div className="quantity-control" style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--soft-pastel)", padding: "6px 12px" }}>
                      <button className="quantity-btn" onClick={() => handleQty(item.id, item.size, -1)}>−</button>
                      <input type="text" className="quantity-input" value={item.quantity} readOnly style={{ width: "30px", textAlign: "center", background: "none", border: "none" }} />
                      <button className="quantity-btn" onClick={() => handleQty(item.id, item.size, 1)}>+</button>
                    </div>
                    <div className="cart-item-price" style={{ fontSize: "16px", fontWeight: "500", color: "var(--deep-violet)" }}>LKR {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary" style={{ background: "white", border: "0.5px solid var(--light-border)", padding: "32px", position: "sticky", top: "100px" }}>
            <div className="summary-title" style={{ fontFamily: "'Cormorant Garamond'", fontSize: "18px", fontStyle: "italic", borderBottom: "0.5px solid var(--light-border)", paddingBottom: "16px", marginBottom: "16px" }}>Order Summary</div>
            <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}><span>Subtotal</span><span>LKR {subtotal.toLocaleString()}</span></div>
            <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}><span>Shipping</span><span>{shipping === 0 ? "FREE" : `LKR ${shipping.toLocaleString()}`}</span></div>
            <div className="summary-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px" }}><span>Tax (5%)</span><span>LKR {tax.toLocaleString()}</span></div>
            <div className="summary-row total" style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "500", color: "var(--deep-violet)", marginTop: "16px", paddingTop: "16px", borderTop: "0.5px solid var(--light-border)" }}><span>Total</span><span>LKR {total.toLocaleString()}</span></div>
            <div className="checkout-ctas" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Link href="/checkout" className="btn-checkout" style={{ background: "var(--deep-violet)", color: "white", textAlign: "center", padding: "14px", textDecoration: "none", textTransform: "uppercase", fontSize: "13px", letterSpacing: "0.12em" }}>Proceed to Checkout</Link>
              <Link href="/shop" className="btn-continue" style={{ background: "transparent", color: "var(--deep-violet)", textAlign: "center", padding: "14px", textDecoration: "none", border: "0.5px solid var(--light-border)", fontSize: "13px", letterSpacing: "0.12em" }}>Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}