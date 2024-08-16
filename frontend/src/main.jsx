import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { OrderProvider } from "./context/OrderContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

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
