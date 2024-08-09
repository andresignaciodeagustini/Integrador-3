const Preorder = require('../models/preorder.model');
const { createOrderOrPreorder } = require('../utils/database');

async function postPreorder(req, res) {
  try {
    // Crear una preorden en la colección 'preorders'
    const preorder = await createOrderOrPreorder(req.body, Preorder);
    res.status(201).send({
      ok: true,
      message: "Preorden creada correctamente",
      preorder
    });
  } catch (error) {
    console.log(error);
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

module.exports = {
  postPreorder,
  getPreorders
};
