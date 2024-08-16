const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
//Middlewares para controlar administradores
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin')
const upload =  require('../middlewares/upload')


router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);


// Rutas 

router.post("/products",[auth, isAdmin, upload],  productController.postProduct);
router.delete("/products/:id",[auth, isAdmin], productController.deleteProduct);
router.put("/products/:id", [auth, isAdmin, upload], productController.updateProduct);

module.exports = router;
