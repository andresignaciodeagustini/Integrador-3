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
          console.log("Fetching cart for order:", orderId);
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
        console.log("User and token available:", user, token);
        try {
          const response = await api.get(`/preorders/${user._id}`);
          console.log("Preorder response:", response.data);

          const preOrders = response.data;
          if (Array.isArray(preOrders) && preOrders.length > 0) {
            const preOrderData = preOrders[preOrders.length - 1];
            if (preOrderData && Array.isArray(preOrderData.products)) {
              console.log("Productos en el pre-pedido:", preOrderData.products);

              const productsWithDetails = await Promise.all(preOrderData.products.map(async (prod) => {
                console.log("Fetching details for product ID:", prod.product);

                const productDetails = await fetchProductDetails(prod.product);
                if (!productDetails || !productDetails.product) {
                  console.error(`No details found for product ID: ${prod.product}`);
                  return null;
                }

                const { product } = productDetails;
                console.log("Product details found:", product);

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
              console.log("Order state updated with pre-order data:", filteredProductsWithDetails);
            } else {
              console.log("No pre-order products found.");
            }
          } else {
            console.log("No pre-orders found for the user.");
          }
        } catch (error) {
          console.error("Error fetching pre-order on login:", error);
        }
      } else {
        console.log("User or token not available.");
      }
    };

    fetchPreOrder();
  }, [user, token]);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
    calculateTotal();
    CartCount();
    console.log("Order state after updates:", order);
  }, [order]);

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
        console.log("Adding item to cart:", { product: producto._id, quantity: 1 });
        await api.post(`/orders/${user._id}`, { product: producto._id, quantity: 1 });
      } catch (error) {
        console.log("Error adding item to cart:", error);
      }
    }
  }

  function calculateTotal() {
    let totalCount = 0;
    if (order.orders) {
      order.orders.forEach((prod) => {
        if (prod.quantity && prod.price) {
          totalCount += prod.price * prod.quantity;
        }
      });
    }
    setTotal(totalCount);
    console.log("Total calculated:", totalCount);
  }

  function CartCount() {
    let count = 0;
    if (order.orders) {
      order.orders.forEach((prod) => {
        count += prod.quantity;
      });
    }
    setCartCount(count);
    console.log("Cart count calculated:", count);
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
        console.log("Updating item quantity:", { product: id, quantity });
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
      showConfirmButton: true,
      confirmButtonText: "Borrar",
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        const updatedOrder = { ...order, orders: order.orders.filter((prod) => prod._id !== id) };
        setOrder(updatedOrder);

        if (user) {
          try {
            console.log("Removing item from cart:", id);
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

  // Integrar la función sendOrderToMercadoPago
  const sendOrderToMercadoPago = async (orderData) => {
    try {
      console.log("Sending order to Mercado Pago:", orderData);
      const response = await api.post("/create-preference", orderData);
      const { init_point } = response.data;
      console.log("Mercado Pago init_point:", init_point);
      return init_point;
    } catch (error) {
      console.error("Error sending order to Mercado Pago:", error);
      Swal.fire("Error", "No se pudo procesar el pago con Mercado Pago", "error");
    }
  };

  async function postOrder() {
    try {
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

      console.log("Posting order:", nuevaOrden);

      const response = await api.post("/orders", nuevaOrden);

      setOrder({ orders: [] });

      Swal.fire("Orden creada", "La orden se creó correctamente", "success");

      // Enviar la orden a Mercado Pago y obtener el enlace de pago
      const initPoint = await sendOrderToMercadoPago(nuevaOrden);

      if (initPoint) {
        window.location.href = initPoint; // Redirigir al enlace de pago de Mercado Pago
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire("Error", "Hubo un problema al procesar la orden", "error");
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
  };

  return (
    <OrderContext.Provider value={values}>
      {children}
    </OrderContext.Provider>
  );
};
