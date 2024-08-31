const express = require("express");
const router = express.Router();
const Order = require('../models/order.model'); // Asegúrate de que el modelo Order esté bien definido

router.post('/save-preference-id', async (req, res) => {
  const { preferenceId } = req.body;

  if (!preferenceId) {
    return res.status(400).json({ error: 'ID de preferencia no proporcionado' });
  }

  try {
    // Aquí podrías guardar el ID de la preferencia en la base de datos
    const order = await Order.create({ preferenceId, /* otros datos de la orden */ });
    
    res.status(200).json({ message: 'ID de preferencia guardado con éxito', order });
  } catch (error) {
    console.error('Error al guardar el ID de la preferencia:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar el ID de la preferencia' });
  }
});

module.exports = router;