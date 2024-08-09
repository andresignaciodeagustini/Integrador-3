const express = require('express');
const router = express.Router();

const user_routes = require("./user.routes");
const product_routes = require("./product.routes");
const category_routes = require("./category.routes");
const order_routes = require("./order.routes");

const preorderRoutes = require('./preorder.routes');

router.use([user_routes, product_routes, category_routes, order_routes,preorderRoutes ]);

module.exports = router;
