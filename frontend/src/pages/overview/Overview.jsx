import { useEffect, useState } from "react";
import axios from "axios";
import './Overview.css';
import Header from '../../layout/header/Header'; // Importa el componente Header

export default function Overview() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    try {
      const URL = "https://665e5e8e1e9017dc16efd098.mockapi.io/products";
      const response = await axios.get(URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }

  return (
    <>
      <Header /> {/* Incluye el Header */}
      <section className="product-details">
        {products.map((product) => (
          <div key={product.id} className="product-header">
            <div className="image-detail">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-action">
              <h2>{product.name}</h2>
              <h5>{typeof product.price === 'number' ? `AR$‌${product.price.toFixed(2)}` : 'Precio no disponible'}</h5>
              <h6>COLOR</h6>
              <div className="color-picker">
                <button className="color-circle" data-color="black"></button>
                <button className="color-circle" data-color="white"></button>
              </div>
              <div className="tallas-guide">
                <h6>TALLA</h6>
                <div className="tallas-buttons">
                  <button value="2">2</button>
                  <button value="4">4</button>
                  <button value="6">6</button>
                  <button value="16">8</button>
                </div>
              </div>
              <div className="bottom-detail">
                <button className="add-to-bag-button">AÑADIR A LA BOLSA</button>
              </div>
            </div>

            <div className="product-text">
              <h4>Art. Nr. {product.id}. Aranceles de importación incluidos</h4>
              <p>Valentino Ricci introduce una temática innovadora en su colección, fusionando su estilo con un enfoque fresco hacia la elegancia diaria. Un diseño versátil que combina lo clásico, contemporáneo y tradicional. El tul elástico toma una nueva dimensión y se embellece con un sutil detalle metálico para infundir a las prendas con feminidad y carácter.</p>
              <p>Vestido midi de tul elástico con detalle metálico:</p>
              <ul>
                <li>Sin mangas</li>
                <li>Mezcla de tul elástico y gasa de seda</li>
                <li>Cierre con cremallera y gancho en la parte posterior</li>
                <li>Longitud de 90 cm desde la cintura en la talla 42 EU</li>
                <li>La modelo mide 1,70 m y usa la talla 42 EU</li>
                <li>Fabricado en Italia</li>
              </ul>
              <p>Composición externa: 55% Poliéster 20% Rayón 18% Nylon 7% Elastano</p>
              <p>Composición interna: 89% Seda 11% Elastano</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
