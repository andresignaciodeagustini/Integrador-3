import React, { useState } from 'react';
import videoBackground from '../../assets/images/main/video1.mp4'; 
import ProductList from '../../components/product-list/ProductList';
import OrderSidebar from '../../layout/order-sidebar/OrderSidebar';
import NewSection from '../../components/new-section/NewSection';  
import FinalSection from '../../components/final-section/FinalSection'; 
import './home.css';

export default function Home() {
  const [showOrderSidebar, setShowOrderSidebar] = useState(false); 

  const handleBuyClick = () => {
    setShowOrderSidebar(true); 
  };

  return (
    <>
      <div className="video-container">
        <video className="background-video"
          src={videoBackground}
          autoPlay
          loop
          muted
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      
      <NewSection />

     
      <div className={`season`}>
        <p className="eb-garamond-season">
          RICCI          
        </p>
        <button className="season-button">
          DESCUBRIR
        </button>
      </div>

      <ProductList />
      
    
      <FinalSection />
    
      {showOrderSidebar && <OrderSidebar />}
    </>
  );
}
