// src/Admin/AdminLayout.tsx
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";
import styles from "./AdminLayout.module.css";

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/makers", label: "Makers" },
  { to: "/admin/disputes", label: "Disputes" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

const AdminLayout = () => {
  const { admin, loading, error, isDevBypass, refresh } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className={styles.stateWrapper}>
        <div className={styles.state}>
          <p className={styles.stateSpinner}>◌</p>
          <p>Verifying admin session…</p>
        </div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className={styles.stateWrapper}>
        <div className={styles.state}>
          <p className={styles.stateError}>{error ?? "Access denied."}</p>
          <button
            type="button"
            className={styles.stateRetryBtn}
            onClick={refresh}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Dev bypass banner */}
      {isDevBypass && (
        <div className={styles.devBanner}>
          DEV BYPASS — backend auth skipped. Set VITE_ADMIN_DEV_BYPASS=false
          to enable real auth.
        </div>
      )}

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>BRUTIGE</span>
          <span className={styles.brandSub}>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.adminName}>
            {admin.firstName} {admin.lastName}
          </p>
          <p className={styles.adminEmail}>{admin.email}</p>
          <p className={styles.adminRole}>
            {admin.roles?.join(", ") ?? "ADMIN"}
          </p>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topBar}>
          <h1 className={styles.pageTitle}>
            {NAV_ITEMS.find(
              (item) =>
                item.to === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.to),
            )?.label ?? "Admin"}
          </h1>
          <span className={styles.timestamp}>
            {new Date().toLocaleDateString("en-NG", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </header>

        <div className={styles.viewport}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;