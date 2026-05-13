"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <h1 className="admin-title">Customers</h1>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Orders</th><th>Joined</th></tr></thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.city}</td><td>{c.orderCount}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .admin-title { font-family: 'Cormorant Garamond'; font-size: 36px; font-style: italic; margin-bottom: 24px; }
        .admin-table { width: 100%; border-collapse: collapse; background: white; }
        .admin-table th, .admin-table td { padding: 12px; border: 1px solid var(--light-border); text-align: left; }
      `}</style>
    </div>
  );
}