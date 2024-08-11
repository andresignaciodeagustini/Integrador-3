// utils/database.js

async function createOrderOrPreorder(data, Model) {
  const { user, products } = data;

  // Verifica si el usuario está definido y si products es un array
  if (!user || !Array.isArray(products) || products.length === 0) {
    throw new Error("Datos incompletos para crear una orden o preorden");
  }

  const newEntry = new Model(data);
  return await newEntry.save();
}

module.exports = {
  createOrderOrPreorder
};
