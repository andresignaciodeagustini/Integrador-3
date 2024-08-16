const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller')



//GET categories
router.get("/categories", categoryController.getCategories,)

//Post categories

router.post("/categories", categoryController.createCategory)





module.exports = router