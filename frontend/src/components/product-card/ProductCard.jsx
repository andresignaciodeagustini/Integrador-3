import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";
import { faBagShopping, faEye } from "@fortawesome/free-solid-svg-icons"; // Actualizado
import { useOrder } from "../../context/OrderContext.jsx";

export default function ProductCard({ product }) {
  const { addOrderItem } = useOrder();
  const [heartActive, setHeartActive] = useState(false);

  const handleHeartClick = () => {
    setHeartActive(!heartActive);
    addOrderItem(product); // Añadir el producto a la orden cuando se hace clic en el corazón
  };

  return (
    <article className="product-card">
      <div className="card-header">
        <div className="product-image">
          <img src={`http://localhost:3000/images/products/${product.image}`} alt={product.name} />
          <div className="button-container">
            <Link className="btn-icon btn-icon-eye" to={`/product-detail/${product._id}`}>
              <FontAwesomeIcon 
                icon={faEye} 
                title="Ver más"
              />
            </Link>
            <button
              className={`btn-icon btn-icon-bag ${heartActive ? 'active' : ''}`}
              onClick={handleHeartClick}
            >
              <FontAwesomeIcon icon={faBagShopping} /> {/* Actualizado */}
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="product-name">
          <a href="#">{product.name}</a>
        </div>
        <div className="product-price">
          $ {product.price}
        </div>
      </div>
      {/* Elimina la sección de código para el botón de "Añadir" */}
    </article>
  );
}
