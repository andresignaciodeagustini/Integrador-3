





const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 80
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 100,
        trim: true,
        lowercase: true
        // Elimina la validación personalizada del formato del email
        // validate: {
        //     validator: (value) => {
        //         const regex = /^[A-Za-z0-9._+\-']+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        //         return regex.test(value);
        //     },
        //     message: 'Correo electrónico inválido'
        // }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 100,
        trim: true
    },
    bornDate: {
        type: Date,
        required: true
    },
    location: {
        type: String
    },
    role: {
        type: String,
        default: "CLIENT_ROLE",
        enum: ["ADMIN_ROLE", "CLIENT_ROLE", "USER_ROLE"]
    }
}, {
    collection: 'users' // Especifica la colección explícitamente
});

module.exports = mongoose.model("User", userSchema);