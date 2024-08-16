import { useState, useContext, createContext, useEffect } from "react";
import Swal from 'sweetalert2';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  // estado de la orden
  const [order, setOrder] = useState(JSON.parse(localStorage.getItem("order")) || []);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Actualizar localStorage cada vez que cambie el estado de `order`
    localStorage.setItem("order", JSON.stringify(order));
    calculateTotal();
  }, [order]);

  // función para agregar producto
  function addOrderItem(producto) {
    const product = order.find((prod) => prod.id === producto.id);
    if (product) {
      handleChangeQuantity(product.id, product.quantity + 1);
    } else {
      producto.quantity = 1;
      setOrder((prevOrder) => [...prevOrder, producto]);
    }
  }

  // calcular total
  function calculateTotal() {
    let totalCount = 0;
    order.forEach((prod) => {
      totalCount += prod.price * prod.quantity;
    });
    setTotal(totalCount);
  }

  // manejar cambios de cantidad
  function handleChangeQuantity(id, quantity) {
    const updatedOrder = order.map(item => {
      if (item.id === id) {
        item.quantity = quantity;
      }
      return item;
    });
    setOrder(updatedOrder);
  }

  // eliminar un producto del pedido
  function removeItem(id) {
    Swal.fire({
      title: "Borrar Archivo",
      text: "Realmente desea quitar este producto?",
      icon: "error",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedOrder = order.filter((prod) => prod.id !== id);
        setOrder(updatedOrder);
      }
    });
  }

  return (
    <OrderContext.Provider value={{ order, total, addOrderItem, handleChangeQuantity, removeItem }}>
      {children}
    </OrderContext.Provider>
  );
};
