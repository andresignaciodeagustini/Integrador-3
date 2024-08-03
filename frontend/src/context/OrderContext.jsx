import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';
import { useUser } from "./UserContext";
import useApi from "../services/interceptor/Interceptor";

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const { user, token, logout } = useUser(); // Agrega logout desde useUser
  const api = useApi();

  // Estado inicial del carrito
  const [order, setOrder] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarToggle, setSidebarToggle] = useState(false);

  // Recupera el carrito del usuario cuando se inicia sesión
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await api.get(`/cart/${user._id}`);
          setOrder(response.data || []);
        } catch (error) {
          console.log("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  useEffect(() => {
    calculateTotal();
    CartCount();
  }, [order]);

  async function addOrderItem(producto) {
    const existingProduct = order.find(prod => prod._id === producto._id);

    if (existingProduct) {
      handleChangeQuantity(existingProduct._id, existingProduct.quantity + 1);
    } else {
      const updatedOrder = [...order, { ...producto, quantity: 1 }];
      setOrder(updatedOrder);

      if (user) {
        try {
          await api.post(`/cart/${user._id}`, { product: producto._id, quantity: 1 });
        } catch (error) {
          console.log("Error adding item to cart:", error);
        }
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
  }

  function CartCount() {
    let count = 0;
    order.forEach((prod) => {
      count += prod.quantity;
    });
    setCartCount(count);
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
        await api.put(`/cart/${user._id}`, { product: id, quantity });
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
            api.delete(`/cart/${user._id}/${id}`);
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
        user: user._id,
        products
      };

      await api.post("/orders", nuevaOrden);
      Swal.fire("Orden creada", "La orden se creó correctamente", "success");
      setOrder([]);

      if (user) {
        try {
          await api.delete(`/cart/${user._id}`);
        } catch (error) {
          console.log("Error clearing cart after order:", error);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Error al crear la orden", "error");
    }
  }

  // Manejar el cierre de sesión
  const handleLogout = async () => {
    if (user) {
      try {
        await api.delete(`/cart/${user._id}`);
      } catch (error) {
        console.log("Error clearing cart on logout:", error);
      }
    }
    logout(); // Ejecuta la lógica de cierre de sesión
  };

  return (
    <OrderContext.Provider value={{ 
      order, 
      total, 
      cartCount, 
      addOrderItem, 
      handleChangeQuantity, 
      removeItem, 
      sidebarToggle,
      toggleSidebarOrder,
      closeSidebar,
      postOrder,
      handleLogout // Proporciona la función de cierre de sesión
    }}>
      {children}
    </OrderContext.Provider>
  );
};
