// ../../pages/Home.js
import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import modelo1 from '../../assets/images/main/modelo1.jpg';
import modelo2 from '../../assets/images/main/modelo2.jpg';
import modelo3 from '../../assets/images/main/modelo3.jpg';
import ProductList from '../../components/product-list/ProductList';
import OrderSidebar from '../../layout/order-sidebar/OrderSidebar';
import NewSection from '../../components/new-section/NewSection'; // Importa el nuevo componente

export default function Home() {
  const [showOrderSidebar, setShowOrderSidebar] = useState(false); 

  const handleBuyClick = () => {
    setShowOrderSidebar(true); 
  };

  return (
    <>
      <Carousel
        autoPlay={true}
        interval={6000}
        transitionTime={2000}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        className="carousel"
      >
        <div>
          <img src={modelo1} alt="Modelo 1" />
        </div>
        <div>
          <img src={modelo2} alt="Modelo 2" />
        </div>
        <div>
          <img src={modelo3} alt="Modelo 3" />
        </div>
      </Carousel>

      {/* Agrega la nueva sección aquí */}
      <NewSection />

      <ProductList />
      
      {showOrderSidebar && <OrderSidebar />}
    </>
  );
}
