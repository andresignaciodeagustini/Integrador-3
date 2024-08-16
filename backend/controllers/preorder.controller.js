const Preorder = require('../models/preorder.model');
const Product = require('../models/product.model'); // Importar el modelo Product

// Crear una preorden
async function postPreorder(req, res) {
  try {
    if (req.user._id !== req.body.user) {
      return res.status(400).send({
        ok: false,
        message: "No puedes crear una preorden para otro usuario"
      });
    }
    
    if (req.body.products.length === 0) {
      return res.status(400).send({
        ok: false,
        message: "No puedes crear una preorden vacía"
      });
    }

    await orderProductPriceVerification(req.body.products, req.body.total);

    const preorder = new Preorder(req.body);
    const newPreorder = await preorder.save();

    res.status(201).send({
      ok: true,
      message: "Preorden creada correctamente",
      preorder: newPreorder
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al crear la preorden"
    });
  }
}

// Obtener todas las preordenes, opcionalmente filtrando por idUser
async function getPreorders(req, res) {
  try {
    const idUser = req.params.idUser;
    const query = idUser ? { user: idUser } : {};
    
    const preorders = await Preorder.find(query)
      .populate("user", "fullName")
      .populate("products.product");
    
    res.status(200).send({
      ok: true,
      message: "Preordenes obtenidas correctamente",
      preorders
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al obtener las preordenes"
    });
  }
}

// Obtener una preorden específica por ID
async function getPreorderById(req, res) {
  try {
    const { id } = req.params;
    
    const preorder = await Preorder.findById(id)
      .populate("user", "fullName")
      .populate("products.product");

    if (!preorder) {
      return res.status(404).send({
        ok: false,
        message: "Preorden no encontrada"
      });
    }

    res.status(200).send({
      ok: true,
      message: "Preorden obtenida correctamente",
      preorder
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al obtener la preorden"
    });
  }
}

// Eliminar una preorden específica por ID
async function deletePreorder(req, res) {
  try {
    const { id } = req.params;
    
    const deletedPreorder = await Preorder.findByIdAndDelete(id);

    if (!deletedPreorder) {
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
    console.log(error);
    res.status(500).send({
      ok: false,
      message: error.message || "Error al eliminar la preorden"
    });
  }
}

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
  postPreorder,
  getPreorders,
  getPreorderById,
  deletePreorder
};
