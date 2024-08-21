const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configuración de almacenamiento para productos
const storageProducts = multer.diskStorage({
    destination: 'public/images/products',
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (error, buffer) => {
            if (error) return cb(error);
            const filename = buffer.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

// Configuración de almacenamiento para usuarios
const storageUsers = multer.diskStorage({
    destination: 'public/images/users',
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (error, buffer) => {
            if (error) return cb(error);
            const filename = buffer.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

// Instancias de multer
const uploadProductImage = multer({ storage: storageProducts }).single("image");
const uploadUserImage = multer({ storage: storageUsers }).single("image");

module.exports = { uploadProductImage, uploadUserImage };
