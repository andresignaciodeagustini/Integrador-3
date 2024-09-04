import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Header.css';
import logoBlanco from '../../assets/images/header/logo_fondo_blanco1.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useOrder } from '../../context/OrderContext';
import { useUser } from '../../context/UserContext';

const Header = ({ isProductDetailPage }) => {
  const { toggleSidebarOrder, order, sidebarToggle, cartCount, postPreOrder } = useOrder();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();
  const { user, logout } = useUser();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isSpecialPage = ['/about-us', '/login', '/contact', '/register', '/admin-product', '/admin-user', '/product-detail'].includes(location.pathname);

  const handleCartClick = () => {
    toggleSidebarOrder();
    setIsMenuOpen(false); 
  };

  const handleLogout = async () => {
    try {
      if (user) {
        const products = (order.orders || []).map(item => ({
          quantity: item.quantity,
          product: item._id,
          price: item.price
        }));
        await postPreOrder(); 
        logout(); 
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`header-nav ${isScrolled || isSpecialPage || isProductDetailPage ? 'scroll-bg-white' : 'transparent-bg'} ${sidebarToggle && isMobileView ? 'hide-header' : ''} ${isProductDetailPage ? 'product-detail-header' : ''}`}>
     
      <nav className={`nav-links ${isMenuOpen ? 'open' : ''} ${isMobileView ? 'mobile-view' : ''}`}>
        <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>PRINCIPAL</NavLink>
        {user ? (
          <NavLink to="/" className="nav-link" onClick={handleLogout}>LOGOUT</NavLink>
        ) : (
          <NavLink to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>LOGIN</NavLink>
        )}

        <NavLink to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>CONTACT</NavLink>
        <NavLink to="/about-us" className="nav-link" onClick={() => setIsMenuOpen(false)}>ABOUT US</NavLink>
        <NavLink to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>REGISTER</NavLink>

        {user?.role === "ADMIN_ROLE" && (
          <>
            <NavLink to="/admin-product" className="nav-link" onClick={() => setIsMenuOpen(false)}>ADMIN PRODUCT</NavLink>
            <NavLink to="/admin-user" className="nav-link" onClick={() => setIsMenuOpen(false)}>ADMIN USER</NavLink>
          </>
        )}
      </nav>

      <NavLink to="/" className="logo">
        <img src={isSpecialPage ? logoBlanco : logoBlanco} alt='Logo' />
      </NavLink>

      <div className={`user-info ${isScrolled || isSpecialPage || isProductDetailPage ? 'black-icons' : 'white-icons'}`}>
        <div className='user-cart-container'>
          <FontAwesomeIcon
            icon={faBagShopping}
            onClick={handleCartClick}
            className="bag-shopping"
            style={{ cursor: 'pointer' }}
          />
          {cartCount > 0 && (
            <div className="cart-counter" data-count={cartCount}>
              {cartCount}
            </div>
          )}
        </div>
        <span
          className="material-symbols-outlined user-icon"
          style={{ cursor: 'pointer' }}
        >
          person
        </span>
        <div
          className={`menu-icon ${isMenuOpen || isScrolled || isSpecialPage || isProductDetailPage ? 'black' : ''}`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="close-button" onClick={() => setIsMenuOpen(false)}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>

      {!isSpecialPage && !isProductDetailPage && (
        <div className={`season ${isScrolled || sidebarToggle ? 'hide' : ''}`}>
          <p className="eb-garamond-season">
            RICCI          
          </p>
          <button className="season-button">
            DESCUBRIR
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
