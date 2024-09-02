import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { initMercadoPago } from '@mercadopago/sdk-react'; // Importa la función para inicializar Mercado Pago

// Inicializa Mercado Pago con tu clave pública
initMercadoPago('APP_USR-24216c85-3170-45ba-9463-158b4a04cd7c');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </UserProvider>
    </Router>
  </React.StrictMode>
);
