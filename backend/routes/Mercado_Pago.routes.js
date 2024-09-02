const { Router } = require("express");
const mercadopago = require("mercadopago");
const MercadoPagoConfig = mercadopago.MercadoPagoConfig;
const Preference = mercadopago.Preference;
const dotenv = require("dotenv");
const Product = require('../models/product.model');
dotenv.config();

const Mercado_Pago = Router();
const key = process.env.ACCESS_MERCADOPAGO;


const client = new MercadoPagoConfig({ accessToken: key });


// Endpoint para crear una preferencia de Mercado Pago
Mercado_Pago.post('/create-preference', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);

    const { products } = req.body; // Asegúrate de que estás extrayendo los productos correctamente

    if (!products || !products.length) {
        return res.status(400).json({ error: 'No se enviaron items para la preferencia' });
    }

    try {
        console.log('Preparando los datos para la preferencia');

        // Obtener información adicional del producto (como el nombre)
        const detailedItems = await Promise.all(products.map(async (item) => {
            // Buscar producto por ID
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Producto con ID ${item.product} no encontrado`);
            }
            return {
                title: product.name, // Obtener nombre del producto desde la base de datos
                quantity: item.quantity,
                unit_price: item.price
            };
        }));

        const preferenceData = {
            body: {
                items: detailedItems,
                back_urls: {
                    success: "https://www.yotube.com",
                    failure: "https://www.yotube.com",
                    pending: "https://www.yotube.com"
                },
                auto_return: "approved",
            }
        };

        console.log('Datos de la preferencia:', preferenceData);
        const preference = new Preference(client);

        // Crear la preferencia con Mercado Pago
        const response = await preference.create(preferenceData);
        
        res.json({
            id: response.id,
        })
        console.log('Respuesta de Mercado Pago:', response);
        res.status(200).json(response.body); // Enviar solo el body de la respuesta al frontend
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear la preferencia' });
    }
});
Mercado_Pago.post('/webhook', async (req, res) => {
    console.log('Webhook recibido:', req.body);

    const payment = req.body.data.id;
    const topic = req.body.type;

    if (topic === 'payment') {
        try {
            const response = await mercadopago.payment.findById(payment);
            console.log('Información del pago:', response.body);

            // Aquí actualiza el estado de la orden en tu base de datos
            // Ejemplo:
            // await updateOrderStatus(response.body);

            res.status(200).send('Pago recibido');
        } catch (error) {
            console.error('Error al obtener el pago:', error);
            res.status(500).send('Error interno');
        }
    } else {
        res.status(400).send('Evento no manejado');
    }
});

module.exports = Mercado_Pago;

