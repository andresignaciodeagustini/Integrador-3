const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Función para determinar el directorio de destino
const getDestination = (req, file, cb) => {
  let folder = 'public/images/products'; // Por defecto, para productos

  // Cambiar el directorio de destino según algún criterio
  if (req.route.path.includes('/users')) {
    folder = 'public/images/users';
  }

  cb(null, folder);
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (error, buffer) => {
      if (error) return cb(error);
      const filename = buffer.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

const upload = multer({ storage }).single("image");

module.exports = upload;
