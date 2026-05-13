"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const COLORS = ["#4A1D7A", "#8B6BAF", "#B47DC8", "#C4A8E8", "#6B6478", "#C9A96E"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?period=${period}`)
      .then(res => res.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [period]);

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (error) return <div className="analytics-error">Error: {error}</div>;
  if (!data) return <div className="analytics-empty">No data available</div>;

  // Check if there are orders
  const hasOrders = data.summary.totalOrders > 0;

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics Dashboard</h1>

      <div className="period-selector">
        <button className={period === "week" ? "active" : ""} onClick={() => setPeriod("week")}>Weekly</button>
        <button className={period === "month" ? "active" : ""} onClick={() => setPeriod("month")}>Monthly</button>
        <button className={period === "quarter" ? "active" : ""} onClick={() => setPeriod("quarter")}>Quarterly</button>
      </div>

      {!hasOrders ? (
        <div className="no-orders-message">
          <p>No orders found for the selected period.</p>
          <p>Try changing the period or check back later.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card"><h3>Total Revenue</h3><p>LKR {data.summary.totalRevenue.toLocaleString()}</p></div>
            <div className="card"><h3>Orders</h3><p>{data.summary.totalOrders}</p></div>
            <div className="card"><h3>Unique Customers</h3><p>{data.summary.uniqueCustomers}</p></div>
          </div>

          {/* Top Products */}
          {data.topProducts.length > 0 && (
            <div className="chart-card">
              <h2>Top Products by Revenue</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
                  <YAxis />
                  <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4A1D7A" name="Revenue (LKR)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Breakdown */}
          {data.categoryBreakdown.length > 0 && (
            <div className="two-columns">
              <div className="chart-card">
                <h2>Sales by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `LKR ${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h2>Category Revenue Table</h2>
                <table className="data-table">
                  <thead><tr><th>Category</th><th>Revenue</th><th>Items Sold</th></tr></thead>
                  <tbody>
                    {data.categoryBreakdown.map(cat => (
                      <tr key={cat.category}>
                        <td>{cat.category}</td>
                        <td>LKR {cat.revenue.toLocaleString()}</td>
                        <td>{cat.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customer Geography */}
          <div className="two-columns">
            <div className="chart-card">
              <h2>Top Cities</h2>
              {data.customerGeo.topCities.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>City</th><th>Customer Count</th></tr></thead>
                  <tbody>
                    {data.customerGeo.topCities.map(city => (
                      <tr key={city.city}><td>{city.city}</td><td>{city.count}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No city data available</p>}
            </div>
            <div className="chart-card">
              <h2>Countries</h2>
              {data.customerGeo.countries.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>Country</th><th>Customer Count</th></tr></thead>
                  <tbody>
                    {data.customerGeo.countries.map(country => (
                      <tr key={country.country}><td>{country.country}</td><td>{country.count}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No country data available</p>}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .analytics-container { padding: 20px; background: var(--soft-pastel); min-height: 100vh; }
        .analytics-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; margin-bottom: 28px; }
        .period-selector { display: flex; gap: 12px; margin-bottom: 32px; }
        .period-selector button { padding: 8px 20px; background: white; border: 1px solid var(--light-border); border-radius: 30px; cursor: pointer; transition: all 0.2s; }
        .period-selector button.active { background: var(--deep-violet); color: white; border-color: var(--deep-violet); }
        .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 20px; margin-bottom: 40px; }
        .card { background: white; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .card h3 { font-size: 14px; color: var(--mid-gray); margin-bottom: 8px; }
        .card p { font-size: 28px; font-weight: 600; color: var(--deep-violet); }
        .chart-card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .chart-card h2 { font-size: 20px; margin-bottom: 20px; }
        .two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 10px; text-align: left; border-bottom: 1px solid var(--light-border); }
        .data-table th { background: #f8f5f0; }
        .no-orders-message { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; }
        .analytics-loading, .analytics-error, .analytics-empty { text-align: center; padding: 60px; background: white; border-radius: 12px; }
        @media (max-width: 768px) { .two-columns { grid-template-columns: 1fr; } .period-selector button { padding: 6px 16px; font-size: 12px; } }
      `}</style>
    </div>
  );
}