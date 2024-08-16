import './Footer.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import logoTransparente from '../../assets/images/header/logo_fondotransparente.png';

const Footer = () => {
  return (
    <footer>
      <div className="footer-header">
        <img src={logoTransparente} alt="Logo" />
      </div>
      <div className="footer">
        <div className="contain">
          <div className="col">
            <h1>Company</h1>
            <ul>
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Legal</li>
            </ul>
          </div>
          <div className="col">
            <h1>Products</h1>
            <ul>
              <li>New Arrivals</li>
              <li>Best Sellers</li>
              <li>Featured</li>
              <li>Categories</li>
              <li>Offers</li>
            </ul>
          </div>
          <div className="col">
            <h1>Accounts</h1>
            <ul>
              <li>Login</li>
              <li>Sign Up</li>
              <li>Orders</li>
              <li>Wishlist</li>
              <li>Settings</li>
            </ul>
          </div>
          <div className="col">
            <h1>Our Services</h1>
            <ul>
              <li>Order Help</li>
              <li>Gift Cards</li>
              <li>Product Care</li>
              <li>Store Locator</li>
              <li>Custom Orders</li>
            </ul>
          </div>
          <div className="col">
            <h1>Support</h1>
            <ul>
              <li>Help Center</li>
              <li>Returns</li>
              <li>Shipping</li>
              <li>FAQs</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="footer-bottom">
          <div className="final">
            <span>© Valentino Ricci S.r.l. P.IVA IT04586091261</span>
          </div>
          <div className="footer-left">
            <span>¿QUERES SABER MÁS?</span>
            <NavLink className="btn-style4" to="#">REGÍSTRATE</NavLink>
            <NavLink className="btn-style5" to="#">INGRESA</NavLink>
          </div>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faWhatsapp} /></a>
            <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
