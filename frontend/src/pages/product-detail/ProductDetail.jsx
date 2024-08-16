import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useOrder } from "../../context/OrderContext";
import useApi from "../../services/interceptor/Interceptor";
import Header from "../../layout/header/Header";
import OrderSidebar from "../../layout/order-sidebar/OrderSidebar";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { addOrderItem } = useOrder();
  const api = useApi();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(true);
  const [addedToBagMessage, setAddedToBagMessage] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log("ID del producto desde useParams:", id);

    if (!id) {
      console.error("ID del producto no encontrado");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log("Iniciando solicitud para obtener el producto con ID:", id);
        const response = await api.get(`/products/${id}`);
        console.log("Respuesta de la API para el producto:", response);
        console.log("Datos del producto recibidos:", response.data);
        setProduct(response.data.product);  // Asegúrate de acceder a la propiedad correcta
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, api]);

  const closeDetail = () => {
    setDetailVisible(false);
  };

  const handleAddToBag = () => {
    if (product) {
      addOrderItem(product);
      setAddedToBagMessage(true);
      setTimeout(() => {
        setAddedToBagMessage(false);
      }, 5000);
    }
  };

  if (loading) {
    return <h4>Cargando...</h4>;
  }

  if (!detailVisible) {
    return null;
  }

  if (!product) {
    return <h4>Producto no encontrado</h4>;
  }

  return (
    <>
      <Header isProductDetailPage={true} />

      <div>
        <section className="product-details">
          <div className="product-header">
            <div className="image-detail">
              <img src={`http://localhost:3000/images/products/${product.image}`} alt={product.name} />
            </div>
            <div className="product-action">
              <h2>{product.name}</h2>
              <h5>{`AR$ ${product.price}`}</h5>
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
                  <button value="8">8</button>
                </div>
              </div>
              <div className="bottom-detail">
                <button className="add-to-bag-button" onClick={handleAddToBag}>
                  AÑADIR 
                </button>
                {addedToBagMessage && (
                  <p className="added-to-bag-message">SE HA AÑADIDO EL PRODUCTO</p>
                )}
              </div>
            </div>

            <div className="product-header-icon">
              <Link to="/">
                <FontAwesomeIcon icon={faTimes} className="custom-icon" onClick={closeDetail} />
              </Link>
            </div>
          </div>

          <div className="product-text">
            <h4>{`Art. Nr. ${product._id}. Aranceles de importación incluidos`}</h4>
            <p>{product.description}</p>
            {/* Asegúrate de que `product.details` esté definido y tenga un valor válido */}
            {product.details && <p>{product.details}</p>}
          </div>
        </section>
      </div>

      <OrderSidebar />
    </>
  );
};

export default ProductDetail;
