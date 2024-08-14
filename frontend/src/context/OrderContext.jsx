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
  const [orderId, setOrderId] = useState(null); // Estado para almacenar el id de la orden


  useEffect(() => {
    const fetchCart = async () => {
      if (orderId) { // Cambiar la condición para usar el id de la orden
        try {
          console.log("Fetching cart for order:", orderId); // Debugging log
          const response = await api.get(`/orders/${orderId}`);
          setOrder(response.data || { orders: [] });
        } catch (error) {
          console.log("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, [orderId]); // Cambiar la dependencia a orderId

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
    calculateTotal();
    CartCount(); // Asegúrate de llamar a CartCount aquí
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
        console.log("Adding item to cart:", { product: producto._id, quantity: 1 }); // Debugging log
        await api.post(`/order/${user._id}`, { product: producto._id, quantity: 1 });
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
    console.log("Total calculated:", totalCount); // Debugging log
  }

  function CartCount() {
    let count = 0;
    if (order.orders) {
      order.orders.forEach((prod) => {
        count += prod.quantity;
      });
    }
    setCartCount(count);
    console.log("Cart count calculated:", count); // Debugging log
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
        console.log("Updating item quantity:", { product: id, quantity }); // Debugging log
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
            console.log("Removing item from cart:", id); // Debugging log
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

      console.log("Posting order:", nuevaOrden); // Debugging log

      await api.post("/orders", nuevaOrden);
      await postPreOrder();

      Swal.fire("Orden creada", "La orden y la preorden se crearon correctamente", "success");
      setOrder({ orders: [] });

      if (user) {
        try {
          await api.delete(`/orders/${user._id}`);
        } catch (error) {
          console.log("Error clearing cart after order:", error);
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire("Error", "Hubo un problema al procesar la orden", "error");
    }
  }

  async function postPreOrder() {
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
  
      const nuevaPreorden = {
        total,
        user: user._id,
        products
      };
  
      console.log("Posting pre-order:", nuevaPreorden);
  
      // Enviar la preorden al backend
      const response = await api.post("/preorders", nuevaPreorden);
  
      // Obtener la preorden completa desde el backend
      const preOrderData = response.data.preorder;
  
      // Actualizar el estado de la orden con la preorden obtenida
      setOrder({
        orders: preOrderData.products.map(product => ({
          _id: product.product._id,
          name: product.product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.product.image, // Asumiendo que el producto tiene una imagen
        }))
      });
  
      console.log("Order state updated with pre-order data:", preOrderData);
  
      Swal.fire("Orden creada", "La orden y la preorden se crearon correctamente", "success");
      setOrder({ orders: [] });
  
      if (user) {
        try {
          await api.delete(`/orders/${user._id}`);
        } catch (error) {
          console.log("Error clearing cart after order:", error);
        }
      }
    } catch (error) {
      console.error("Error creating pre-order:", error);
      Swal.fire("Error", "Hubo un problema al procesar la orden", "error");
    }
  }
  

  return (
    <OrderContext.Provider value={{
      order,
      total,
      cartCount, // Pasar cartCount aquí
      sidebarToggle,
      handleChangeQuantity,
      addOrderItem,
      removeItem,
      toggleSidebarOrder,
      closeSidebar,
      postOrder,
      postPreOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};
