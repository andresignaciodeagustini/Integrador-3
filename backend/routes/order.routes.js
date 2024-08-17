const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Crear una nueva orden
router.post("/orders", auth, orderController.postOrder);

// Obtener todas las órdenes, opcionalmente filtrando por idUser
router.get("/orders", auth, orderController.getOrders);

// Obtener una orden por ID
router.get("/orders/:id", auth, orderController.getOrderById);

// Actualizar una orden por ID
router.put("/orders/:id", auth, orderController.updateOrder);

// Eliminar una orden por ID
router.delete("/orders/:id", auth,isAdmin, orderController.deleteOrder);

module.exports = router;
