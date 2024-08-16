import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import OrderSidebar from './order-sidebar/OrderSidebar';
import Footer from './footer/Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <OrderSidebar />
      <main className="main-container"></main>
      <Outlet />
      <Footer />
    </>
  );
}
