import './App.css';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AdminProduct from "./pages/admin-product/AdminProduct";
import Contact from "./pages/contact/Contact";
import Register from "./pages/register/Register";
import AboutUs from "./pages/about-us/AboutUs";
import AdminUser from './pages/admin-user/AdminUser';
import Overview from "./pages/overview/Overview";
import { Route, Routes } from "react-router-dom";
import ProductDetail from "./pages/product-detail/ProductDetail";
import AdminGuard from './services/guard/AdminGuard';
import NotFound from './pages/not-found/NotFound';
import Layout from './layout/layout';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="register" element={<Register />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="overview" element={<Overview />} />
        </Route>

        <Route path="/product-detail/:id" element={<ProductDetail />} />

        {/* Rutas protegidas */}
        <Route path="/admin-product" element={
          <AdminGuard>
            <AdminProduct />
          </AdminGuard>
        } />

        <Route path="/admin-user" element={
          <AdminGuard>
            <AdminUser />
          </AdminGuard>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
