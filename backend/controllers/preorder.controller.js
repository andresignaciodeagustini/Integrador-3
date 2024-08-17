const Preorder = require('../models/preorder.model');
const { orderProductPriceVerification } = require('./order.controller');
const mongoose = require('mongoose');

async function postPreorder(req, res) {
  try {
    const { user, total, products } = req.body;

    console.log("Datos recibidos en postPreorder:", req.body); // Log de los datos recibidos

    // Validación básica de datos
    if (!user || typeof total !== 'number') {
      return res.status(400).send({
        ok: false,
        message: "Datos incompletos para crear la preorden"
      });
    }

    // Log de los productos antes de la verificación
    console.log("Productos antes de la verificación:", products);

    // Validación adicional (opcional):
    // - Verificar si el usuario puede crear preórdenes
    // - Verificar si los productos están disponibles para preorden (solo si hay productos)
    if (products && products.length > 0) {
      await orderProductPriceVerification(products, total);
    }

    // Crear una preorden
    const preorder = new Preorder(req.body);
    const newPreorder = await preorder.save();

    res.status(201).send({
      ok: true,
      message: "Preorden creada correctamente",
      preorder: newPreorder,
    });
  } catch (error) {
    console.error("Error en postPreorder:", error); // Log del error
    res.status(500).send({
      ok: false,
      message: error.message || "Error al crear la preorden"
    });
  }
}


async function getPreorders(req, res) {
  try {
    const { idUser } = req.params;
    const query = idUser ? { user: idUser } : {};
    const preorders = await Preorder.find(query);
    res.status(200).send(preorders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al obtener las preordenes"
    });
  }
}

async function getPreorderById(req, res) {
  try {
    const id = req.params.id;
    console.log("ID recibido:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        ok: false,
        message: "ID inválido"
      });
    }

    let order = await Preorder.findById(id)
      .populate('user', 'fullName') // Popula el campo `user` con el campo `fullName`
      .populate({
        path: 'products.product', // Popula el campo `product` dentro del array `products`
        select: 'name price' // Selecciona solo los campos `name` y `price`
      });

    console.log("Orden después del populate:", order);

    if (!order) {
      return res.status(404).send({
        ok: false,
        message: "Preorden no encontrada"
      });
    }

    res.status(200).send({
      ok: true,
      order
    });
  } catch (error) {
    console.log("Error al obtener la preorden:", error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al obtener la preorden"
    });
  }
}

async function deletePreorder(req, res) {
  try {
    const id = req.params.id;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        ok: false,
        message: "ID inválido"
      });
    }

    // Eliminar la preorden
    const result = await Preorder.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send({
        ok: false,
        message: "Preorden no encontrada"
      });
    }

    res.status(200).send({
      ok: true,
      message: "Preorden eliminada correctamente"
    });
  } catch (error) {
    console.log("Error al eliminar la preorden:", error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al eliminar la preorden"
    });
  }
}


module.exports = {
  postPreorder,
  getPreorders,
  getPreorderById,
  deletePreorder
};
