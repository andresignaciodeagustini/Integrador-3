import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { initMercadoPago } from '@mercadopago/sdk-react'; // Importa la función para inicializar Mercado Pago

// Inicializa Mercado Pago con tu clave pública
initMercadoPago('TEST-0c0e389d-a3b1-4df4-ad32-b81b6475b2c1');

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
