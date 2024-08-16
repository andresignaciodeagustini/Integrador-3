const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// GET users with pagination
router.get("/users", userController.getUsers);

// GET user by id
router.get("/users/:id", userController.getUserById);

// POST create new user
router.post("/users", userController.postUser);

// DELETE user by id
router.delete("/users/:id", [auth, isAdmin], userController.deleteUser);

// PUT update user by id
router.put("/users/:idUpdate", userController.updateUser);

// POST login
router.post("/login", userController.login);

module.exports = router;