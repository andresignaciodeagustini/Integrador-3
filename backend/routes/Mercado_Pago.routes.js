const {Router} = require("express");

const mercadopago = require("mercadopago");
const MercadoPagoConfig = mercadopago.MercadoPagoConfig;
const Preference = mercadopago.Preference;
const dotenv = require("dotenv");
dotenv.config();

const Mercado_Pago = Router();



const client = new MercadoPagoConfig({ accessToken: 'TEST-7216497546452179-081811-6d799c149db2505cdecaadc4adbe5c0e-98244982' });


const preference = new Preference(client);

// Endpoint para crear una preferencia de Mercado Pago
Mercado_Pago.post('/create-preference', async (req, res) => {
    try {
      const response = await preference.create({
        body: {
          items: [
            {
              title: 'Mi producto',
              quantity: 1,
              unit_price: 2000
            }
          ],
        }
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al crear la preferencia' });
    }
  });

module.exports = Mercado_Pago;

module.exports = Mercado_Pago;