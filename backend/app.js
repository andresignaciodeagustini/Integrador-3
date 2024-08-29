const express = require("express");
const app = express();
const cors = require('cors');
const Mercado_Pago = require('./routes/Mercado_Pago.routes'); // Ruta correcta con capitalización correcta
const api_routes = require("./routes/index");

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:5173', // La URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware para interpretar datos JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar la ruta de Mercado_Pago
app.use("/api", Mercado_Pago);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Usar las rutas definidas en index.js
app.use("/api", api_routes);

module.exports = app;
