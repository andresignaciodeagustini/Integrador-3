const router = require('express').Router();
const preorderController = require('../controllers/preorder.controller');
const auth = require('../middlewares/auth');

// Crear preorden
router.post("/preorders", auth, preorderController.postPreorder);

// Obtener todas las preordenes, opcionalmente filtrando por idUser
router.get("/preorders/:idUser?", auth, preorderController.getPreorders);

module.exports = router;
