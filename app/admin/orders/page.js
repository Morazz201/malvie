"use client";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setToastMsg("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      fetchOrders();
      setToastMsg("Status updated");
    } catch (err) {
      setToastMsg("Failed to update status");
    }
  };

  const printShippingSlip = (order) => {
    const items = Array.isArray(order.items) ? order.items : (() => {
      try {
        return JSON.parse(order.items);
      } catch {
        return [];
      }
    })();

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Shipping Slip - ${order.id.slice(-8)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .items td { border-bottom: 1px solid #ccc; padding: 8px; }
        .items th { text-align: left; background: #f0f0f0; }
      </style>
      </head><body>
        <h1>Malvie Shipping Slip</h1>
        <p><strong>Order #:</strong> ${order.id.slice(-8)}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <h2>Customer Details</h2>
        <p>
          ${order.customer?.name || "Unknown"}<br/>
          ${order.customer?.address || ""}<br/>
          ${order.customer?.city || ""} ${order.customer?.postalCode || ""}<br/>
          ${order.customer?.phone || ""}<br/>
          ${order.customer?.email || ""}
        </p>
        <h2>Items</h2>
        <table class="items" width="100%">
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>
            ${items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>LKR ${item.price.toLocaleString()}</td></tr>`).join('')}
          </tbody>
        </table>
        <p><strong>Total: LKR ${order.total.toLocaleString()}</strong></p>
        <hr/><p>Thank you for shopping with Malvie!</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <>
      <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg("")} />
      <div>
        <h1 className="admin-orders-title">Orders</h1>
        <div className="table-responsive">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(-8)}</td>
                  <td>
                    {order.customer?.name}<br/>
                    <span className="email-small">{order.customer?.email}</span>
                  </td>
                  <td className="price">LKR {order.total.toLocaleString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`status-select status-${order.status.toLowerCase()}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-small" onClick={() => printShippingSlip(order)}>
                      🖨️ Print Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <style jsx>{`
          .admin-orders-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            font-style: italic;
            margin-bottom: 28px;
            color: var(--charcoal);
          }
          .table-responsive {
            overflow-x: auto;
          }
          .admin-orders-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .admin-orders-table th,
          .admin-orders-table td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--light-border);
          }
          .admin-orders-table th {
            background: #f8f5f0;
            font-weight: 600;
            font-size: 13px;
            color: var(--deep-violet);
          }
          .admin-orders-table tr:hover td {
            background: var(--soft-pastel);
          }
          .email-small {
            font-size: 12px;
            color: var(--mid-gray);
          }
          .price {
            font-weight: 500;
            color: var(--deep-violet);
          }
          .status-select {
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            border: none;
            background: transparent;
            cursor: pointer;
          }
          .status-pending { background: #fff3e0; color: #c47d2e; }
          .status-confirmed { background: #e0f2fe; color: #0c6b9e; }
          .status-shipped { background: #e0e7ff; color: #1e3a8a; }
          .status-delivered { background: #dcfce7; color: #166534; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .btn-small {
            background: var(--deep-violet);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 12px;
          }
          .btn-small:hover {
            background: var(--dusty-plum);
          }
          .admin-loading {
            text-align: center;
            padding: 60px;
            font-size: 16px;
            color: var(--mid-gray);
          }
        `}</style>
      </div>
    </>
  );
}