const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10; 
const secret = process.env.SECRET;


// Obtener usuario por ID
async function getUserById(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select({ password: 0 });

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "No se pudo encontrar el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario encontrado",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "No se pudo obtener usuario"
        });
    }
}

// Obtener usuarios con paginación
async function getUsers(req, res) {
    try {
        const limit = parseInt(req.query.limit, 10) || 3
        const page = parseInt(req.query.page, 10) || 0;

        const filters = {};
        if (req.query.name) {
            filters.fullname = { $regex: req.query.name, $options: 'i' };
        }

        const [users, total] = await Promise.all([
            User.find(filters)
                .select({ password: 0 })
                .collation({ locale: 'es' })
                .skip(page * limit)
                .limit(limit)
                .sort({ fullname: 1 }),
            User.countDocuments(filters)
        ]);

        res.status(200).send({
            ok: true,
            message: "Usuarios obtenidos correctamente",
            users,
            total
        });

    } catch (error) {
        console.log("Error en getUsers:", error);
        res.status(500).send({
            ok: false,
            message: "Error al obtener usuarios"
        });
    }
}

// Crear un nuevo usuario
async function postUser(req, res) {
    try {
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        if (req.user?.role !== "ADMIN_ROLE") {
            req.body.role = "CLIENT_ROLE";
        }

        if (!req.body.password) {
            console.log('Error: La contraseña no está presente en req.body');
            return res.status(400).send({
                ok: false,
                message: "La contraseña es requerida"
            });
        }

        console.log('Contraseña antes de hashear:', req.body.password);

        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        console.log('Contraseña hasheada:', req.body.password);

        const user = new User(req.body);

        if (req.file?.filename) {
            user.image = req.file.filename;
        }

        const newUser = await user.save();
        newUser.password = undefined;

        res.status(201).send({
            ok: true,
            message: "Usuario creado correctamente",
            user: newUser
        });

    } catch (error) {
        console.log('Error en postUser:', error);
        res.status(500).send({
            ok: false,
            message: "Error al crear el usuario"
        });
    }
}
// Eliminar usuario por ID
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario que deseaba borrar"
            });
        }

        res.status(200).send({
            ok: true,
            message: "El usuario fue borrado correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "Error al borrar el usuario"
        });
    }
}

// Actualizar usuario por ID usando parámetro de ruta
async function updateUser(req, res) {
    try {
        const id = req.params.id; // Obteniendo el ID de la URL

        // Verifica que el ID es un ObjectId válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                ok: false,
                message: "ID de usuario inválido"
            });
        }
        // Verificar permisos
        if (req.user.role !== 'ADMIN_ROLE' && req.user._id.toString() !== id) {
            return res.status(400).send({
                ok: false,
                message: "No se puede editar este usuario"
            });
        }

        const newData = req.body;

        // Hashear la contraseña si se proporciona
        if (newData.password) {
            newData.password = await bcrypt.hash(newData.password, saltRounds);
        }

        // Resetear el rol si el usuario no es admin
        if (req.user.role !== 'ADMIN_ROLE') {
            newData.role = undefined;
        }

        // Manejo de imágenes
        if (req.file?.filename) {
            newData.image = req.file.filename;
        } else {
            delete newData.image; // Solo si deseas eliminar el campo si no hay archivo
        }

        // Actualizar el usuario
        const updUser = await User.findByIdAndUpdate(id, newData, { new: true });

        if (!updUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontró el usuario"
            });
        }

        res.status(200).send({
            ok: true,
            message: "Usuario actualizado correctamente",
            user: updUser
        });

    } catch (error) {
        console.log('Error en updateUser:', error);
        res.status(500).send({
            ok: false,
            message: "No se pudo editar el usuario"
        });
    }
}

async function login(req, res) {
    try {
        const email = req.body.email?.toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send({
                ok: false,
                message: "Email y password son requeridos"
            });
        }

        console.log('Email:', email);
        console.log('Password:', password);
    
        const user = await User.findOne({ email: { $regex: email, $options: "i" } });
        console.log('Usuario encontrado:', user);

        if (!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        // Verificación de la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                ok: false,
                message: "Datos incorrectos"
            });
        }

        user.password = undefined; // Remover la contraseña del usuario para no enviarla en el token

        const token = jwt.sign({ user }, secret, { expiresIn: '1h' });

        res.status(200).send({
            ok: true,
            message: "Login exitoso",
            user,
            token
        });

    } catch (error) {
        console.log('Error en login:', error);
        res.status(500).send({
            ok: false,
            message: "Error al hacer el login"
        });
    }
}

module.exports = {
    getUsers,
    postUser,
    deleteUser,
    updateUser,
    getUserById,
    login
};
