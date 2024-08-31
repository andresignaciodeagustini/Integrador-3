import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { useUser } from "./UserContext";
import useApi from "../services/interceptor/Interceptor";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { user, token, logout } = useUser();
  const api = useApi();

  const [order, setOrder] = useState({ orders: [] });
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (orderId) {
        try {
          const response = await api.get(`/orders/${orderId}`);
          setOrder(response.data || { orders: [] });
        } catch (error) {
          console.log("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, [orderId]);

  async function fetchProductDetails(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchPreOrder = async () => {
      if (user && token) {
        try {
          const response = await api.get(`/preorders/${user._id}`);
          const preOrders = response.data;
          if (Array.isArray(preOrders) && preOrders.length > 0) {
            const preOrderData = preOrders[preOrders.length - 1];
            if (preOrderData && Array.isArray(preOrderData.products)) {
              const productsWithDetails = await Promise.all(preOrderData.products.map(async (prod) => {
                const productDetails = await fetchProductDetails(prod.product);
                if (!productDetails || !productDetails.product) {
                  console.error(`No details found for product ID: ${prod.product}`);
                  return null;
                }

                const { product } = productDetails;

                return {
                  _id: product._id,
                  quantity: prod.quantity,
                  name: product.name,
                  image: product.image,
                  price: prod.price,
                };
              }));

              const filteredProductsWithDetails = productsWithDetails.filter(product => product !== null);

              setOrder({ orders: filteredProductsWithDetails });
            }
          }
        } catch (error) {
          console.error("Error fetching pre-order on login:", error);
        }
      }
    };

    fetchPreOrder();
  }, [user, token]);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
    calculateTotal();
    CartCount();
  }, [order]);

  function calculateTotal() {
    const totalCount = order.orders.reduce((acc, prod) => acc + (prod.quantity * prod.price), 0);
    setTotal(totalCount);
  }

  function CartCount() {
    const count = order.orders.reduce((acc, prod) => acc + prod.quantity, 0);
    setCartCount(count);
  }

  async function addOrderItem(producto) {
    if (!user) {
      Swal.fire({
        title: "Error",
        text: "Debe estar logueado para agregar productos al carrito",
        icon: "warning",
        timer: 4000
      });
      return;
    }

    const existingProduct = order.orders.find(prod => prod._id === producto._id);

    if (existingProduct) {
      handleChangeQuantity(existingProduct._id, existingProduct.quantity + 1);
    } else {
      const updatedOrder = { ...order, orders: [...order.orders, { ...producto, quantity: 1 }] };
      setOrder(updatedOrder);

      try {
        await api.post(`/orders/${user._id}`, { product: producto._id, quantity: 1 });
      } catch (error) {
        console.log("Error adding item to cart:", error);
      }
    }
  }

  async function handleChangeQuantity(id, quantity) {
    const updProducts = order.orders.map((item) => {
      if (item._id === id) {
        return { ...item, quantity: +quantity };
      }
      return item;
    });

    const updatedOrder = { ...order, orders: updProducts };
    setOrder(updatedOrder);

    if (user) {
      try {
        await api.put(`/order/${user._id}`, { product: id, quantity });
      } catch (error) {
        console.log("Error updating item quantity:", error);
      }
    }
  }

  function removeItem(id) {
    Swal.fire({
      title: "Borrar producto",
      text: "¿Realmente desea quitar este producto?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        const updatedOrder = { ...order, orders: order.orders.filter((prod) => prod._id !== id) };
        setOrder(updatedOrder);

        if (user) {
          try {
            api.delete(`/order/${user._id}/${id}`);
          } catch (error) {
            console.log("Error removing item from cart:", error);
          }
        }
      }
    });
  }

  function toggleSidebarOrder() {
    setSidebarToggle(prev => !prev);
  }

  function closeSidebar() {
    setSidebarToggle(false);
  }

  const sendOrderToMercadoPago = async (orderData) => {
    try {
      // Enviar la orden y crear la preferencia en Mercado Pago
      const response = await api.post("/create-preference", orderData);
      
      // Asegúrate de que la respuesta contiene el ID de la preferencia
      const { id } = response.data;
  
      if (id) {
        return id; // Devolver el ID de la preferencia
      } else {
        throw new Error("No se recibió el ID de la preferencia");
      }
    } catch (error) {
      console.error("Error sending order to Mercado Pago:", error);
      Swal.fire("Error", "No se pudo procesar el pago con Mercado Pago", "error");
      throw error; // Lanza el error para que pueda ser manejado por la función que llama a esta
    }
  };
  async function postOrder() {
    if (!user || !token) {
      Swal.fire({
        title: "Error",
        text: "Debe estar logueado para realizar una orden",
        icon: "warning",
        timer: 4000
      });
      return;
    }
  
    const products = order.orders.map(item => ({
      quantity: item.quantity,
      product: item._id,
      price: item.price
    }));
  
    const nuevaOrden = {
      total,
      user: user._id,
      products
    };
  
    try {
      const response = await api.post("/orders", nuevaOrden);
      setOrder({ orders: [] });
      Swal.fire("Orden creada", "La orden se creó correctamente", "success");
  
      // Obtener el ID de la preferencia de Mercado Pago
      const preferenceId = await sendOrderToMercadoPago(nuevaOrden);
  
      if (preferenceId) {
        return { preferenceId }; // Devolver el ID de la preferencia
      } else {
        throw new Error("No se recibió el ID de la preferencia");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire("Error", "Hubo un problema al procesar la orden", "error");
    }
  }
  
  async function postPreOrder() {
    if (!user || !token) {
      Swal.fire({
        title: "Error",
        text: "Debe estar logueado para realizar una orden",
        icon: "warning",
        timer: 4000
      });
      return;
    }

    const products = order.orders.map(item => ({
      quantity: item.quantity,
      product: item._id,
      price: item.price
    }));

    const nuevaPreorden = {
      total,
      user: user._id,
      products
    };

    try {
      const response = await api.post("/preorders", nuevaPreorden);
      const preOrderData = response.data.preorder;

      if (preOrderData && Array.isArray(preOrderData.products)) {
        setOrder({
          orders: preOrderData.products.map(product => {
            if (product.product && product.product._id) {
              return {
                _id: product.product._id,
                price: product.price,
                quantity: product.quantity,
              };
            } else {
              console.error("Product or product ID missing:", product);
              return null;
            }
          }).filter(product => product !== null)
        });
      } else {
        console.log("No pre-order data found.");
      }
    } catch (error) {
      console.error("Error creating pre-order:", error);
    }
  }

  const values = {
    order,
    total,
    cartCount,
    sidebarToggle,
    toggleSidebarOrder,
    closeSidebar,
    setOrderId,
    addOrderItem,
    handleChangeQuantity,
    removeItem,
    postOrder,
    postPreOrder
  };

  return (
    <OrderContext.Provider value={values}>
      {children}
    </OrderContext.Provider>
  );
};
