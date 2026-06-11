import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { clearToken } from "../lib/auth";
import AdminBrandLogo from "./AdminBrandLogo";
import { authApi } from "../lib/authapi";

const menu = [
  { to: "/", label: "Dashboard" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  // { to: "/blogs", label: "Blogs" },
  // { to: "/instagram-posts", label: "Instagram Feed" },
  { to: "/orders", label: "Orders & delivery" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      clearToken();
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="adminBrand">
          <div className="adminBrandRow">
            <AdminBrandLogo />
            <div>
              <div className="adminBrandTitle">Pushpanjali</div>
              <div className="adminBrandSub">Admin panel</div>
            </div>
          </div>
        </div>

        <nav className="adminNav">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `adminNavItem ${isActive ? "adminNavItemActive" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="adminSidebarFooter">
          <button className="adminLogoutBtn" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="adminMain">
        <header className="adminHeader">
          <div className="adminHeaderLeft">
            <div className="adminHeaderTitle">Admin</div>
            <div className="adminHeaderHint">Manage catalog and site content</div>
          </div>
        </header>

        <main className="adminContent">
          <Outlet />
        </main>

        <footer className="adminFooter">
          <div className="adminFooterInner">
            © {new Date().getFullYear()} Pushpanjali • Admin portal
          </div>
        </footer>
      </div>
    </div>
  );
}

