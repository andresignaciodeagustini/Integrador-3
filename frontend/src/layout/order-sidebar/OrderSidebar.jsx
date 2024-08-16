import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useOrder } from '../../context/OrderContext';
import './OrderSidebar.css';

export default function OrderSidebar() {
  const { order, total, handleChangeQuantity, removeItem, sidebarToggle, closeSidebar } = useOrder();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Verificar que order es un array
  const orderList = Array.isArray(order) ? order : [];

  return (
    <div className={`order-wrapper ${sidebarToggle ? 'active' : ''} ${isMobileView ? 'mobile-view' : ''}`}>
      <div className="close-icon" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className="list-container">
        <h2>Orden actual:</h2>
        <ul className="order-list">
          {orderList.length > 0 ? (
            orderList.map((product) => (
              <li className="order-item" key={product.id}>
                <img
                  className="order-image"
                  src={product.image || "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"}
                  alt=""
                />
                <div className="order-item-name" title={product.name}>
                  {product.name}
                </div>
                <div className="order-quantity">
                  <input
                    type="number"
                    className="order-quantity-input"
                    value={product.quantity}
                    onChange={(evt) => handleChangeQuantity(product.id, evt.target.value)}
                  />
                </div>
                <div className="order-price">$ {product.price}</div>
                <div className="order-actions">
                  <FontAwesomeIcon
                    icon={faTrash}
                    title="Eliminar producto"
                    onClick={() => removeItem(product.id)}
                  />
                </div>
              </li>
            ))
          ) : (
            <li className="order-item">No hay productos en la orden.</li>
          )}
        </ul>
      </div>
      <div className="order-finish">
        <div className="total">
          <div className="total-count">Items: {orderList.reduce((acc, item) => acc + item.quantity, 0)}</div>
          <div className="total-price">
            Total $ <span>{total}</span>
          </div>
        </div>
        <div className="order-purchase">
        
        </div>
      </div>
    </div>
  );
}
