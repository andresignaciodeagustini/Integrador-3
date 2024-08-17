async function createOrderOrPreorder(data, Model) {
  const { user, products, total } = data;

  // Verifica si el usuario está definido, si products es un array y si total está presente
  if (!user || !Array.isArray(products) || products.length === 0 || total === undefined) {
    throw new Error("Datos incompletos para crear una orden o preorden");
  }

  // Asegúrate de que total sea un número válido
  if (typeof total !== 'number' || isNaN(total)) {
    throw new Error("El campo 'total' debe ser un número válido");
  }

  const newEntry = new Model(data);
  return await newEntry.save();
}

module.exports = {
  createOrderOrPreorder
};
