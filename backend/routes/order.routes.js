const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middlewares/auth');

// Crear orden
router.post("/orders", auth, orderController.postOrder);

// Obtener todas las órdenes, opcionalmente filtrando por idUser
router.get("/orders/:idUser?", auth, orderController.getOrders);

// Obtener una orden específica por ID
router.get("/orders/:orderId", auth, orderController.getOrderById);

// Eliminar una orden específica por ID
router.delete("/orders/:orderId", auth, orderController.deleteOrder);


module.exports = router;
