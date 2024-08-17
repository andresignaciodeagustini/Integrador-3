const Order = require('../models/order.model');
const Product = require('../models/product.model');



const mongoose = require('mongoose');

// Función para crear una nueva orden
async function postOrder(req, res) {
    try {
        console.log("Datos recibidos en postOrder:", req.body); // Log de los datos recibidos

        if (req.user._id !== req.body.user) {
            return res.status(400).send({
                ok: false,
                message: "No puedes crear una orden para otro usuario"
            });
        }
        if (req.body.products.length === 0) {
            return res.status(400).send({
                ok: false,
                message: "No puedes crear una orden vacía"
            });
        }

        // Log de los productos antes de la verificación
        console.log("Productos antes de la verificación:", req.body.products);

        // Validar productos antes de crear la orden
        await orderProductPriceVerification(req.body.products, req.body.total);

        const order = new Order(req.body);
        const newOrder = await order.save();

        // Obtener todas las órdenes después de crear una nueva
        const orders = await getOrdersInternal(req.user.role, req.user._id);

        res.status(201).send({
            ok: true,
            message: "Orden creada correctamente",
            order: newOrder,
            orders // Incluir todas las órdenes en la respuesta
        });
    } catch (error) {
        console.log("Error en postOrder:", error); // Log del error
        res.status(500).send({
            ok: false,
            message: error.message || "Error al crear la orden"
        });
    }
}
// Función para obtener todas las órdenes
async function getOrders(req, res) {
    try {
        
        const orders = await getOrdersInternal(req.user.role, req.user._id);
        res.status(200).send({
            ok: true,
            orders
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: error.message || "Error al obtener órdenes"
        });
    }
}

// Función para obtener una orden por ID
async function getOrderById(req, res) {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
                ok: false,
                message: "ID inválido"
            });
        }

        // Buscar la orden por ID
        let order = await Order.findById(id);
        console.log("Orden antes del populate:", order); // Verificar el estado de la orden antes del populate

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        // Realizar el populate de los campos referenciados
        order = await Order.findById(id)
            .populate("user", "fullName")
            .populate({
                path: "products.product",
                select: "name price" // Puedes ajustar los campos que quieres seleccionar
            });

        console.log("Orden después del populate:", order); // Verificar el estado de la orden después del populate

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada después del populate"
            });
        }

        res.status(200).send({
            ok: true,
            order
        });
    } catch (error) {
        console.log("Error al obtener la orden:", error); // Detalles del error
        res.status(500).send({
            ok: false,
            message: error.message || "Error al obtener la orden"
        });
    }
}


// Función para actualizar una orden por ID
async function updateOrder(req, res) {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (req.user.role !== "ADMIN_ROLE" && req.user._id.toString() !== updates.user.toString()) {
            return res.status(403).send({
                ok: false,
                message: "No tienes permiso para actualizar esta orden"
            });
        }

        // Validar productos antes de actualizar la orden
        await orderProductPriceVerification(updates.products, updates.total);

        const updatedOrder = await Order.findByIdAndUpdate(id, updates, { new: true })
            .populate("user", "fullName")
            .populate("products.product");

        if (!updatedOrder) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Orden actualizada correctamente",
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: error.message || "Error al actualizar la orden"
        });
    }
}

// Función para eliminar una orden por ID
async function deleteOrder(req, res) {
    try {
        const id = req.params.id;

        // Verificar permisos para eliminar la orden
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).send({
                ok: false,
                message: "Orden no encontrada"
            });
        }

        if (req.user.role !== "ADMIN_ROLE" && req.user._id.toString() !== order.user.toString()) {
            return res.status(403).send({
                ok: false,
                message: "No tienes permiso para eliminar esta orden"
            });
        }

        await Order.findByIdAndDelete(id);

        res.status(200).send({
            ok: true,
            message: "Orden eliminada correctamente"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: error.message || "Error al eliminar la orden"
        });
    }
}

// Función interna para obtener órdenes
async function getOrdersInternal(role, userId) {
    try {
        let filter;

        if (role === "ADMIN_ROLE") {
            filter = {};
        } else {
            filter = { user: userId };
        }

        const orders = await Order.find(filter)
            .populate("user", "fullName")
            .populate("products.product");

        return orders;
    } catch (error) {
        console.log(error);
        throw new Error("Error al obtener órdenes");
    }
}

// Verificación de precios de productos
async function orderProductPriceVerification(products, total) {
    try {
        let totalOrder = 0;

        for (let prod of products) {
            totalOrder += prod.price * prod.quantity;
            const product = await Product.findById(prod.product);

            if (!product || product.price !== prod.price) {
                throw new Error(`El producto con id ${prod.product} no existe o el precio no coincide`);
            }
        }

        if (totalOrder !== total) {
            throw new Error("El total no es correcto");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Error al verificar precios");
    }
}

module.exports = {
    postOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    orderProductPriceVerification
};
