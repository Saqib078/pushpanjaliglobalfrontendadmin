import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .me()
      .then((data) => {
        if (mounted) setMe(data.admin);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || "Failed to load profile");
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <div>
          <h1 className="adminPageTitle">Dashboard</h1>
          <div className="muted">
            {me ? `Signed in as ${me.email}` : "Loading..."}
          </div>
        </div>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="adminGrid2" style={{ marginTop: 14 }}>
        <div className="adminPanel">
          <div className="adminPanelTitle">Catalog</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Manage categories and products.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link className="adminActionBtn" to="/categories">
              Categories
            </Link>
            <Link className="adminActionBtn" to="/products">
              Products
            </Link>
          </div>
        </div>

        <div className="adminPanel">
          <div className="adminPanelTitle">Next</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Manage catalog, then use <strong>Orders &amp; delivery</strong> to hand orders to your delivery company (carrier, AWB, tracking link). Customers see status in their account and thank-you page.
          </div>
        </div>
      </div>
    </div>
  );
}

