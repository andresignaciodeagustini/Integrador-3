const Category = require ('../models/category.model')


async function getCategories(req, res) {
    try {
       
       
        const categories = await Category.find();

        if(categories.length === 0) {
            return res.status(404).send({
                ok:false,
                message: "No hay categorias registradas"
            })

        }

        res.status(200).send({
            ok: true, 
            message: "Categorías obtenidas",
            categories

        })



    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener categorias"
        });
    }
}

async function createCategory(req, res) {
    try {
        const category = new Category(req.body);
        const newCategory = await category.save();
        res.status(200).send({
            ok: true,
            message: "Categoria creada correctamente",
            category:  newCategory
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            ok: false,
            message: "Error al crear categoria"
        });
    }
}








module.exports ={
    getCategories,
    createCategory


}