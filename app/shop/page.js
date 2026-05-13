"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Toast from "@/components/Toast";

export default function Shop() {
  const { addToCart } = useCart();
  const [toastMsg, setToastMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from API
  useEffect(() => {
    fetch("/api/products?activeOnly=true")
      .then(res => res.json())
      .then(data => {
        const optimizedData = data.map(p => {
          let parsedColors = [];
          try {
            if (p.colors) parsedColors = JSON.parse(p.colors);
          } catch { }
          return { ...p, parsedColors };
        });
        setProducts(optimizedData);
        setFilteredProducts(optimizedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  // Filter & sort logic
  useEffect(() => {
    if (!products.length) return;
    let result = [...products];

    // Category filter
    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    if (priceRange !== "all") {
      if (priceRange === "under2000") result = result.filter(p => p.price < 2000);
      else if (priceRange === "2000-2500") result = result.filter(p => p.price >= 2000 && p.price <= 2500);
      else if (priceRange === "above2500") result = result.filter(p => p.price > 2500);
    }

    // Color filter (colors stored as JSON string)
    if (selectedColors.length) {
      result = result.filter(p => {
        return p.parsedColors && p.parsedColors.some(c => selectedColors.includes(c));
      });
    }

    // Sorting
    if (sortBy === "price-low") result.sort((a,b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a,b) => b.price - a.price);
    else if (sortBy === "name-asc") result.sort((a,b) => a.name.localeCompare(b.name));

    setFilteredProducts(result);
  }, [selectedCategories, priceRange, selectedColors, sortBy, products]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange("all");
    setSelectedColors([]);
    setSortBy("featured");
    document.querySelectorAll('input[name="price"]').forEach(radio => {
      if (radio.value === "all") radio.checked = true;
      else radio.checked = false;
    });
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <section className="shop-hero">
        <div className="shop-hero-inner">
          <h1>Shop Malvie</h1>
          <p>Explore our complete collection of soft luxury fashion and lifestyle pieces.</p>
        </div>
      </section>
      <section className="shop-wrap">
        <div className="shop-inner">
          {/* Filters Sidebar */}
          <aside className="shop-filters">
            <div className="filter-group">
              <h3 className="filter-title">Category</h3>
              <div className="filter-option">
                <input type="checkbox" onChange={() => handleCategoryChange("tees")} />
                <label>T‑Shirts & Tops</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" onChange={() => handleCategoryChange("bags")} />
                <label>Bags & Accessories</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" onChange={() => handleCategoryChange("jewelry")} />
                <label>Jewelry</label>
              </div>
              <div className="filter-option">
                <input type="checkbox" onChange={() => handleCategoryChange("lifestyle")} />
                <label>Lifestyle</label>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Price Range</h3>
              <div className="filter-option">
                <input type="radio" name="price" value="all" onChange={(e) => setPriceRange(e.target.value)} defaultChecked />
                <label>All Prices</label>
              </div>
              <div className="filter-option">
                <input type="radio" name="price" value="under2000" onChange={(e) => setPriceRange(e.target.value)} />
                <label>Under LKR 2,000</label>
              </div>
              <div className="filter-option">
                <input type="radio" name="price" value="2000-2500" onChange={(e) => setPriceRange(e.target.value)} />
                <label>LKR 2,000 – 2,500</label>
              </div>
              <div className="filter-option">
                <input type="radio" name="price" value="above2500" onChange={(e) => setPriceRange(e.target.value)} />
                <label>LKR 2,500+</label>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Color</h3>
              {[
                { hex: "#E8DEFF", name: "Lavender" },
                { hex: "#FDFAF5", name: "Cream" },
                { hex: "#1A1625", name: "Charcoal" },
                { hex: "#C9A96E", name: "Gold" },
                { hex: "#B47DC8", name: "Orchid" }
              ].map(color => (
                <div key={color.hex} className="filter-option">
                  <input type="checkbox" onChange={() => handleColorChange(color.hex)} />
                  <label>{color.name}</label>
                </div>
              ))}
            </div>

            <button onClick={resetFilters} className="reset-filters-btn">Reset all filters</button>
          </aside>

          {/* Products Grid */}
          <div className="shop-products">
            <div className="products-header">
              <div className="products-count">Showing {filteredProducts.length} products</div>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                    <div className="product-img-wrap">
                      <div className="product-img" style={{ background: "linear-gradient(145deg, var(--lavender), var(--lilac))" }}>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span style={{ fontSize: "48px" }}>{product.icon}</span>
                        )}
                      </div>
                      <div className="product-overlay">
                        <button
                          className="quick-add"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              icon: product.icon,
                            });
                            setToastMsg(`✨ ${product.name} added to cart`);
                          }}
                        >
                          + Add to Cart
                        </button>
                      </div>
                      {product.badge && <div className="product-badge">{product.badge}</div>}
                    </div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-tagline">{product.tagline}</div>
                    <div className="product-price-row">
                      <span className="product-price">LKR {product.price.toLocaleString()}</span>
                      <div className="product-colors">
                        {product.parsedColors && product.parsedColors.map((c, i) => (
                          <div key={i} className="color-dot" style={{ background: c }}></div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p>No products match your filters. Try resetting them.</p>
                <button onClick={resetFilters} className="btn-primary" style={{ marginTop: "20px" }}>Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}