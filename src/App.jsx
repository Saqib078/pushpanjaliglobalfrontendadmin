import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import { getToken } from "./lib/auth";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import InstagramPosts from "./pages/InstagramPosts";
import Orders from "./pages/Orders";
import AdminLayout from "./components/AdminLayout";

//new
import { useAuth } from './context/AuthContext';
import CategoryDetails from './pages/CategoryDetails';
import Productsnew from './pages/Productsnew';
import ProductsAll from './components/product/ProductsAll';
import AddProduct from './pages/AddProduct';
import ProductMedia from './pages/ProductMedia';
import ProductDetails from './pages/ProductDetails';
import ProductInformationForm from './components/productdetails/ProductInformationForm';
import ProductInformationCreate from './components/productdetails/ProductInformationCreate';
import ProductInformationEdit from './components/productdetails/ProductInformationEdit';
import InstagramCreate from './components/instagram/InstagramCreate';
import Instagram from './components/instagram/Instagram';
import InstagramEdit from './components/instagram/InstagramEdit';

// new -- 24 may 2026
function RequireAuth({ children }) {

  const { admin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!admin) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// function RequireAuth({ children }) {
//   const location = useLocation();
//   // const token = getToken();
//   // if (!token) {
//   //   return <Navigate to="/login" state={{ from: location }} replace />;
//   // }
//   return children;
// }

/** Matches Vite `base` (e.g. /admin/ in production on Hostinger). */
function routerBasename() {
  const b = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  return b || undefined;
}

function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryDetails />} />
          <Route path="/catagories/:slug/product" element={<ProductsAll />} />
          <Route path="/catalogs/:slug/add-product" element={<AddProduct />} />
          <Route path="/products/:slug/media" element={<ProductMedia />} />
          <Route path="/products/:slug" element={<ProductDetails />} />

          <Route path="/products" element={<Productsnew />} />
          <Route path="/products/detailsinfo/:productId" element={<ProductInformationCreate />} />
          <Route path="/products/infoUpdate/:productId" element={<ProductInformationEdit />} />

          <Route
            path="/admin/instagram/create"
            element={<InstagramCreate />}
          />

          <Route
            path="/admin/instagram/edit/:id"
            element={<InstagramEdit />}
          />

          <Route path="/blogs" element={<Blogs />} />
          <Route path="/instagram-posts" element={<Instagram/>} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
