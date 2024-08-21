const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Middlewares para controlar autenticación y roles de administrador
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { uploadProductImage } = require('../middlewares/upload');

// Rutas para manejar productos

// Obtener todos los productos
router.get("/products", productController.getProducts);

// Obtener un producto por su ID
router.get("/products/:id", productController.getProductById);

// Crear un nuevo producto
router.post("/products", [auth, isAdmin, uploadProductImage], productController.postProduct);

// Eliminar un producto por su ID
router.delete("/products/:id", [auth, isAdmin], productController.deleteProduct);

// Actualizar un producto por su ID
router.put("/products/:id", [auth, isAdmin, uploadProductImage], productController.updateProduct);

module.exports = router;
