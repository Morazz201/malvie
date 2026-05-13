"use client";
import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Toast from "@/components/Toast";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error("Not found");
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notFound();
      });
  }, [id]);

  if (loading) return <div className="loading-state">Loading product...</div>;
  if (!product) return notFound();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      image: product.image,
    }, selectedSize);
    setToastMsg(`✨ ${product.name} (Size ${selectedSize}) added to cart`);
  };

  // Safely parse colors
  let colorArray = [];
  try {
    colorArray = JSON.parse(product.colors);
  } catch (e) {
    colorArray = [];
  }

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div className="product-page-wrapper">
        <div className="product-page-grid">
          {/* Image Section */}
          <div className="product-image-container">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-main-image"
              />
            ) : (
              <div className="product-fallback-icon">
                <span className="fallback-emoji">{product.icon}</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="product-details">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-tagline">{product.tagline}</p>
            <div className="product-price">LKR {product.price.toLocaleString()}</div>
            <p className="product-description">{product.description}</p>

            <div className="size-selector">
              {["XS", "S", "M", "L", "XL"].map(s => (
                <button
                  key={s}
                  className={`size-btn ${selectedSize === s ? "active" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <button className="btn-primary add-to-cart-btn" onClick={handleAdd}>
              Add to Cart — LKR {product.price.toLocaleString()}
            </button>

            {colorArray.length > 0 && (
              <div className="product-colors">
                <span className="colors-label">Available colors:</span>
                <div className="color-dots">
                  {colorArray.map((c, i) => (
                    <div key={i} className="color-dot" style={{ background: c }} title={c}></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-page-wrapper {
          padding: 140px 40px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .product-page-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .product-image-container {
          background: linear-gradient(145deg, var(--lavender), var(--lilac));
          aspect-ratio: 3/4;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          overflow: hidden;
        }
        .product-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-fallback-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .fallback-emoji {
          font-size: 120px;
        }
        .product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-style: italic;
          margin-bottom: 8px;
          color: var(--charcoal);
        }
        .product-tagline {
          font-size: 14px;
          color: var(--mid-gray);
          margin-bottom: 20px;
        }
        .product-price {
          font-size: 24px;
          font-weight: 500;
          color: var(--deep-violet);
          margin-bottom: 20px;
        }
        .product-description {
          margin-bottom: 24px;
          color: var(--mid-gray);
          line-height: 1.7;
        }
        .add-to-cart-btn {
          margin-top: 32px;
          width: 100%;
        }
        .product-colors {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .colors-label {
          font-size: 13px;
          color: var(--mid-gray);
        }
        .color-dots {
          display: flex;
          gap: 12px;
        }
        .color-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
          cursor: default;
        }
        .loading-state {
          text-align: center;
          padding: 200px;
          font-size: 16px;
          color: var(--mid-gray);
        }
        @media (max-width: 768px) {
          .product-page-wrapper {
            padding: 120px 20px 60px;
          }
          .product-page-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .product-title {
            font-size: 28px;
          }
          .fallback-emoji {
            font-size: 80px;
          }
        }
      `}</style>
    </>
  );
}