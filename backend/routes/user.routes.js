const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { uploadUserImage } = require('../middlewares/upload');

// Obtener todos los usuarios con paginación
router.get("/users", userController.getUsers);

// Obtener un usuario por su ID
router.get("/users/:id", userController.getUserById);

// Crear un nuevo usuarion
router.post("/users", [uploadUserImage], userController.postUser);

// Eliminar un usuario por su ID
router.delete("/users/:id", [auth, isAdmin], userController.deleteUser);

// Actualizar un usuario por su ID
router.put("/users/:id", [auth, isAdmin, uploadUserImage], userController.updateUser);

// Iniciar sesión
router.post("/login", userController.login);

module.exports = router;
