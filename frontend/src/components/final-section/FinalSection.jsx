// FinalSection.jsx
import React from 'react';
import './FinalSection.css';
import prueba3 from '../../assets/images/carpeta_pruebas/imagen-final.jpg'; 

function FinalSection() {
  return (
    <section className="final-section">
      <div className="final-section-content">
        <div className="final-section-image">
          <img src={prueba3} alt="Imagen de Valentino Ricci" />
        </div>
        <div className="final-section-text">
          <h2>RICCI</h2>
          <p>
            Compra ahora los nuevos productos de Valentino Ricci. Descubre nuestra colección exclusiva de bolsos y prendas para mujer y hombre.
          </p>
          <a href="product-list://" className="buy-now-link">COMPRAR AHORA</a> 
        </div>
      </div>
    </section>
  );
}

export default FinalSection;
