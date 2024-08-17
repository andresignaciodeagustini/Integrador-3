const router = require('express').Router();
const preorderController = require('../controllers/preorder.controller');
const auth = require('../middlewares/auth');

// Crear preorden
router.post("/preorders", auth, preorderController.postPreorder);

// Obtener todas las preordenes, opcionalmente filtrando por idUser
router.get("/preorders/:idUser?", auth, preorderController.getPreorders);

// Obtener una preorden específica por ID
router.get("/preorders/:id", auth, preorderController.getPreorderById);

// Eliminar una preorden específica por ID
router.delete("/preorders/:id", auth, preorderController.deletePreorder);


module.exports = router;
