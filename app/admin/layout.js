"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      // Allow viewing login page without auth check loop
      setIsAuthenticated(false);
      return;
    }

    fetch("/api/admin/check-auth")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.replace("/admin/login");
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      });
  }, [pathname]);

  if (!isAuthenticated && pathname !== "/admin/login") {
    return <div className="admin-loading">Loading...</div>;
  }
  if (pathname === "/admin/login") return <>{children}</>;

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/orders", label: "Orders", icon: "📦" },
    { path: "/admin/products", label: "Products", icon: "🛍️" },
    { path: "/admin/customers", label: "Customers", icon: "👥" },
    { path: "/admin/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">✨</div>
          <div className="logo-text">Malvie Admin</div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin/login");
            }}
            className="logout-btn"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-content">{children}</main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: var(--soft-pastel);
        }
        .admin-sidebar {
          width: 280px;
          background: linear-gradient(180deg, var(--deep-violet) 0%, #2D1150 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          box-shadow: 2px 0 12px rgba(0,0,0,0.08);
        }
        .sidebar-header {
          padding: 32px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          font-size: 28px;
        }
        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .sidebar-nav {
          flex: 1;
          padding: 32px 0 0 0;           /* ← removed left/right padding */
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 24px;            /* ← consistent left padding, full width */
          margin: 0;
          border-radius: 0;               /* ← flat, no rounding */
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 15px;
          font-weight: 500;
          justify-content: flex-start;    /* ← ensure left alignment */
          width: 100%;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          transform: none;                /* ← no shift */
        }
        .nav-link.active {
          background: rgba(255,255,255,0.15);
          color: white;
          box-shadow: none;
        }
        .nav-icon {
          font-size: 20px;
          width: 28px;
          text-align: center;
        }
        .nav-label {
          flex: 1;
          text-align: left;               /* ← explicit left */
        }
        .sidebar-footer {
          padding: 24px 0 32px 0;         /* ← horizontal padding removed */
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          padding: 12px 24px;             /* ← same as nav-link */
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 0;               /* ← flat */
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          justify-content: flex-start;
          text-align: left;
        }
        .logout-btn:hover {
          background: rgba(255,80,80,0.2);
          color: #ffb3b3;
        }
        .admin-content {
          flex: 1;
          padding: 28px 32px;
          overflow-x: auto;
        }
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 16px;
          color: var(--mid-gray);
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 80px;
          }
          .logo-text, .nav-label, .logout-btn .nav-label {
            display: none;
          }
          .sidebar-header {
            justify-content: center;
            padding: 24px 0;
          }
          .logo-icon {
            font-size: 32px;
          }
          .nav-link {
            justify-content: center;
            padding: 12px;
          }
          .nav-icon {
            font-size: 24px;
            width: auto;
          }
          .logout-btn {
            justify-content: center;
            padding: 12px;
          }
          .admin-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}