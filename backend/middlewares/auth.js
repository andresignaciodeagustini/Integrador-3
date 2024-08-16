const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

function jwtVerify(req, res, next) {
    //esto lo usamos en el futuro 
    //const token = req.headers.authorization.split(" ")[1];
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            ok: false,
            message: "El token es requerido"
        });
    }

    jwt.verify(token, SECRET, (error, payload) => {
        if (error) {
            return res.status(401).send({
                ok: false,
                message: "Token vencido o inválido"
            });
        }
        console.log(payload);
        req.user = payload.user;
        next(); // Agregamos el llamado a next() para continuar con la siguiente función en la cadena de middleware
    });
}

module.exports = jwtVerify;
