"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="admin-dashboard-title">Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>LKR {stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Customers</h3>
          <p>{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="recent-orders-section">
        <h2>Recent Orders</h2>
        <div className="table-responsive">
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order.id}>
                  <td><Link href={`/admin/orders`} className="order-link">#{order.id.slice(-8)}</Link></td>
                  <td>{order.customer.name} (<span className="email-small">{order.customer.email}</span>)</td>
                  <td className="price">LKR {order.total.toLocaleString()}</td>
                  <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/orders`} className="btn-small">View</Link>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-style: italic;
          margin-bottom: 28px;
          color: var(--charcoal);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 48px;
        }
        .stat-card {
          background: white;
          padding: 24px 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border: 1px solid var(--light-border);
          text-align: center;
        }
        .stat-card h3 {
          font-size: 14px;
          color: var(--mid-gray);
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .stat-card p {
          font-size: 32px;
          font-weight: 600;
          color: var(--deep-violet);
        }
        .recent-orders-section h2 {
          font-size: 22px;
          font-weight: 500;
          margin-bottom: 20px;
          color: var(--charcoal);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .recent-orders-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .recent-orders-table th,
        .recent-orders-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid var(--light-border);
        }
        .recent-orders-table th {
          background: #f8f5f0;
          font-weight: 600;
          font-size: 13px;
          color: var(--deep-violet);
        }
        .recent-orders-table tr:hover td {
          background: var(--soft-pastel);
        }
        .order-link {
          color: var(--deep-violet);
          text-decoration: none;
          font-weight: 500;
        }
        .order-link:hover {
          text-decoration: underline;
        }
        .email-small {
          font-size: 12px;
          color: var(--mid-gray);
        }
        .price {
          font-weight: 500;
          color: var(--deep-violet);
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .status-pending {
          background: #fff3e0;
          color: #c47d2e;
        }
        .status-confirmed {
          background: #e0f2fe;
          color: #0c6b9e;
        }
        .status-shipped {
          background: #e0e7ff;
          color: #1e3a8a;
        }
        .status-delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        .btn-small {
          background: var(--deep-violet);
          color: white;
          padding: 6px 14px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          display: inline-block;
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
  );
}