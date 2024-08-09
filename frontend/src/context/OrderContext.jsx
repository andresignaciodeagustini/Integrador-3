import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { useUser } from "./UserContext";
import useApi from "../services/interceptor/Interceptor";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { user, token, logout } = useUser();
  const api = useApi();

  const [order, setOrder] = useState(() => {
    const savedOrder = localStorage.getItem('order');
    return savedOrder ? JSON.parse(savedOrder) : [];
  });
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          console.log("Fetching cart for user:", user._id); // Debugging log
          const response = await api.get(`/order/${user._id}`);
          setOrder(response.data || []);
        } catch (error) {
          console.log("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('order', JSON.stringify(order));
    calculateTotal();
    CartCount();
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

    const existingProduct = order.find(prod => prod._id === producto._id);

    if (existingProduct) {
      handleChangeQuantity(existingProduct._id, existingProduct.quantity + 1);
    } else {
      const updatedOrder = [...order, { ...producto, quantity: 1 }];
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
    order.forEach((prod) => {
      if (prod.quantity && prod.price) {
        totalCount += prod.price * prod.quantity;
      }
    });
    setTotal(totalCount);
    console.log("Total calculated:", totalCount); // Debugging log
  }

  function CartCount() {
    let count = 0;
    order.forEach((prod) => {
      count += prod.quantity;
    });
    setCartCount(count);
    console.log("Cart count calculated:", count); // Debugging log
  }

  async function handleChangeQuantity(id, quantity) {
    const updProducts = order.map((item) => {
      if (item._id === id) {
        return { ...item, quantity: +quantity };
      }
      return item;
    });

    setOrder(updProducts);

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
        const products = order.filter((prod) => prod._id !== id);
        setOrder(products);

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
      const products = order.map(item => ({
        quantity: item.quantity,
        product: item._id,
        price: item.price
      }));

      const nuevaOrden = {
        total,
        user: user._id, // Asegúrate de que este campo esté presente
        products
      };

      console.log("Posting order:", nuevaOrden); // Debugging log

      await api.post("/orders", nuevaOrden);
      await postPreOrder();

      Swal.fire("Orden creada", "La orden y la preorden se crearon correctamente", "success");
      setOrder([]);

      if (user) {
        try {
          console.log("Clearing cart after order for user:", user._id); // Debugging log
          await api.delete(`/order/${user._id}`);
        } catch (error) {
          console.log("Error clearing cart after order:", error);
        }
      }
    } catch (error) {
      console.log("Error creating order:", error); // Improved for debugging
      Swal.fire("Error", "Error al crear la orden", "error");
    }
  }

  async function postPreOrder() {
    try {
      if (!user || !token) {
        Swal.fire({
          title: "Error",
          text: "Debe estar logueado para realizar una preorden",
          icon: "warning",
          timer: 4000
        });
        return;
      }
      const products = order.map(item => ({
        quantity: item.quantity,
        product: item._id,
        price: item.price
      }));

      const nuevaPreOrden = {
        total,
        user: user._id,
        products
      };

      console.log("Posting pre-order:", nuevaPreOrden); // Debugging log

      await api.post("/preorders", nuevaPreOrden);
      Swal.fire("Preorden creada", "La preorden se creó correctamente", "success");
    } catch (error) {
      console.log("Error creating preorder:", error); // Improved for debugging
      Swal.fire("Error", "Error al crear la preorden", "error");
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();

      if (user && token) {
        postPreOrder(); // Enviar preorden antes de salir
      }

      event.returnValue = ''; // Para algunos navegadores
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [order, user, token]); // Asegúrate de incluir `user` y `token` como dependencias

  return (
    <OrderContext.Provider value={{
      order,
      total,
      cartCount,
      sidebarToggle,
      toggleSidebarOrder,
      closeSidebar,
      addOrderItem,
      handleChangeQuantity,
      removeItem,
      postOrder,
      postPreOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};
