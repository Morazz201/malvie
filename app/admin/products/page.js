"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "", tagline: "", price: "", category: "tees", colors: "[]", badge: "", icon: "👕", description: "", inventory: 0, isActive: true, image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;
    if (imageFile) {
      imageUrl = await uploadImage();
    }
    const productData = { ...form, price: parseFloat(form.price), inventory: parseInt(form.inventory), image: imageUrl };
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (res.ok) {
      setToastMsg(editingProduct ? "Product updated" : "Product created");
      setEditingProduct(null);
      setForm({ name: "", tagline: "", price: "", category: "tees", colors: "[]", badge: "", icon: "👕", description: "", inventory: 0, isActive: true, image: "" });
      setImageFile(null);
      setImagePreview("");
      fetchProducts();
    } else {
      setToastMsg("Operation failed");
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Delete product?")) {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
        setToastMsg("Product deleted");
      } else {
        setToastMsg("Delete failed");
      }
    }
  };

  const editProduct = (p) => {
    setEditingProduct(p);
    setForm(p);
    setImagePreview(p.image ? p.image : "");
    setImageFile(null);
  };

  if (loading) return <div className="loading-state">Loading products...</div>;

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div className="products-page">
        <div className="page-header">
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product catalog – add, edit, or remove items</p>
        </div>

        {/* Product Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
            {editingProduct && (
              <button type="button" className="cancel-btn" onClick={() => { setEditingProduct(null); setForm({ name: "", tagline: "", price: "", category: "tees", colors: "[]", badge: "", icon: "👕", description: "", inventory: 0, isActive: true, image: "" }); setImageFile(null); setImagePreview(""); }}>
                Cancel Editing
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" placeholder="e.g. She Blooms Graphic Tee" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input type="text" placeholder="Short description (e.g. Oversized fit)" value={form.tagline} onChange={e => setForm({...form, tagline: e.target.value})} />
              </div>
            </div>
            <div className="form-row three-cols">
              <div className="form-group">
                <label>Price (LKR) *</label>
                <input type="number" step="100" placeholder="2200" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="tees">T‑Shirts & Tops</option>
                  <option value="bags">Bags & Accessories</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
              <div className="form-group">
                <label>Inventory</label>
                <input type="number" placeholder="Stock quantity" value={form.inventory} onChange={e => setForm({...form, inventory: e.target.value})} />
              </div>
            </div>
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Colors (JSON array)</label>
                <input placeholder='["#E8DEFF", "#FDFAF5"]' value={form.colors} onChange={e => setForm({...form, colors: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Badge (e.g. New, Bestseller)</label>
                <input placeholder="Optional badge text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} />
              </div>
            </div>
            <div className="form-row two-cols">
              <div className="form-group">
                <label>Icon (emoji)</label>
                <input placeholder="👕" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Active Status</label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                  <span>Product is visible in shop</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" placeholder="Full product description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group image-upload">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} id="productImage" />
              {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /></div>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingProduct ? "Update Product" : "Create Product"}</button>
            </div>
          </form>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <h3 className="table-title">All Products</h3>
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Inventory</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="image-cell">{p.image ? <img src={p.image} alt={p.name} /> : "📷"}</td>
                    <td className="product-name-cell">{p.name}</td>
                    <td className="price-cell">LKR {p.price.toLocaleString()}</td>
                    <td>{p.category}</td>
                    <td>{p.inventory}</td>
                    <td><span className={`status-badge ${p.isActive ? "active" : "inactive"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => editProduct(p)}>✏️ Edit</button>
                      <button className="action-btn delete" onClick={() => deleteProduct(p.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .products-page {
          padding: 8px 0;
        }
        .page-header {
          margin-bottom: 32px;
        }
        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          font-style: italic;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .page-subtitle {
          font-size: 14px;
          color: var(--mid-gray);
        }
        .loading-state {
          text-align: center;
          padding: 60px;
          font-size: 16px;
          color: var(--mid-gray);
        }
        .form-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid var(--light-border);
          margin-bottom: 48px;
          overflow: hidden;
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          background: #faf8f5;
          border-bottom: 1px solid var(--light-border);
        }
        .form-header h2 {
          font-size: 20px;
          font-weight: 500;
          color: var(--deep-violet);
        }
        .cancel-btn {
          background: none;
          border: 1px solid var(--light-border);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          background: var(--soft-pastel);
        }
        .product-form {
          padding: 28px;
        }
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .two-cols {
          flex-wrap: wrap;
        }
        .two-cols .form-group {
          flex: 1;
          min-width: 200px;
        }
        .three-cols .form-group {
          flex: 1;
          min-width: 150px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--deep-violet);
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 10px 14px;
          border: 1px solid var(--light-border);
          border-radius: 10px;
          font-family: inherit;
          font-size: 14px;
          transition: 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--orchid);
          box-shadow: 0 0 0 2px rgba(180,125,200,0.2);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .checkbox-label input {
          width: auto;
        }
        .image-upload {
          margin-top: 8px;
        }
        .image-upload input {
          padding: 8px;
        }
        .image-preview {
          margin-top: 12px;
          max-width: 100px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--light-border);
        }
        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }
        .form-actions {
          margin-top: 24px;
          text-align: right;
        }
        .btn-primary {
          background: var(--deep-violet);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-primary:hover {
          background: var(--dusty-plum);
          transform: translateY(-1px);
        }
        .table-container {
          background: white;
          border-radius: 16px;
          border: 1px solid var(--light-border);
          overflow: hidden;
        }
        .table-title {
          padding: 18px 24px;
          font-size: 18px;
          font-weight: 500;
          color: var(--deep-violet);
          background: #faf8f5;
          border-bottom: 1px solid var(--light-border);
          margin: 0;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
        }
        .products-table th {
          text-align: left;
          padding: 14px 16px;
          background: white;
          font-weight: 600;
          font-size: 13px;
          color: var(--mid-gray);
          border-bottom: 1px solid var(--light-border);
        }
        .products-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--light-border);
          vertical-align: middle;
          font-size: 14px;
        }
        .image-cell img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 8px;
        }
        .product-name-cell {
          font-weight: 500;
          color: var(--charcoal);
        }
        .price-cell {
          font-weight: 500;
          color: var(--deep-violet);
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
        }
        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }
        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }
        .actions-cell {
          white-space: nowrap;
        }
        .action-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          margin: 0 2px;
          transition: 0.2s;
          border-radius: 6px;
        }
        .action-btn.edit:hover {
          background: var(--soft-pastel);
        }
        .action-btn.delete:hover {
          background: #fee2e2;
        }
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 16px;
          }
          .product-form {
            padding: 20px;
          }
          .form-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}