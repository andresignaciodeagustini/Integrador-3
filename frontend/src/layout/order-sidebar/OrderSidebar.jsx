import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useOrder } from '../../context/OrderContext';
import { Wallet } from '@mercadopago/sdk-react'; // Importa el componente Wallet
import './OrderSidebar.css';

export default function OrderSidebar() {
  const { order, total, handleChangeQuantity, removeItem, sidebarToggle, closeSidebar, postOrder } = useOrder();
  console.log("OrderSidebar render - Total:", total);
  console.log("OrderSidebar render - Order:", order);

  const [isMobileView, setIsMobileView] = useState(false);
  const [preferenceId, setPreferenceId] = useState('');
  console.log("Preference ID updated:", preferenceId);

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

  // Log para verificar el total y la orden actual cada vez que el componente se renderiza
  console.log("OrderSidebar render - Total:", total);
  console.log("OrderSidebar render - Order:", order);

  const handleFinishPurchase = async () => {
    try {
      // Llamada a postOrder para crear la orden y obtener el preferenceId
      const response = await postOrder();
      if (response && response.preferenceId) {
        setPreferenceId(response.preferenceId); // Guardar el preferenceId en el estado
      } else {
        console.error("No se recibió preferenceId");
        // Manejar el caso en que no se recibe preferenceId
      }
    } catch (error) {
      console.error("Error finalizando la compra:", error);
    }
  };

  return (
    <div className={`order-wrapper ${sidebarToggle ? 'active' : ''} ${isMobileView ? 'mobile-view' : ''}`}>
      <div className="close-icon" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className="list-container">
        <h2>Orden actual:</h2>
        <ul className="order-list">
          {order.orders && order.orders.map((product) => (
              <li className="order-item" key={product._id}>
                <img
                  className="order-image"
                  src={
                    product.image 
                      ? `${import.meta.env.VITE_IMAGES_URL}/products/${product.image}` 
                      : "https://nayemdevs.com/wp-content/uploads/2020/03/default-product-image.png"
                  }
                  alt={product.name || "Nombre no disponible"}
                />
                <div className="order-item-name" title={product.name || "Nombre no disponible"}>
                  {product.name || "Nombre no disponible"}
                </div>
                <div className="order-quantity">
                  <input
                    type="number"
                    className="order-quantity-input"
                    value={product.quantity}
                    onChange={(evt) => handleChangeQuantity(product._id, evt.target.valueAsNumber)}
                  />
                </div>
                <div className="order-price">$ {product.price}</div>
                <div className="order-actions">
                  <FontAwesomeIcon
                    icon={faTrash}
                    title="Eliminar producto"
                    onClick={() => removeItem(product._id)}
                  />
                </div>
              </li>
          ))}
        </ul>
      </div>
      <div className="order-finish">
        <div className="total">
          <div className="total-count">Items: {order.orders ? order.orders.reduce((acc, item) => acc + item.quantity, 0) : 0}</div>
          <div className="total-price">
            Total $ <span>{total}</span>
          </div>
        </div>
        <div className="order-purchase">
            <button className="btn" onClick={handleFinishPurchase}>Finalizar compra</button>
            {/* Renderiza Wallet solo si preferenceId está definido */}
            {preferenceId && (
              <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
            )}
          </div>
      </div>
    </div>
  );
}
