// ==============================================
// Verificar Token - Implementando middleware - 1/2
//   Originada en: Lección 111 en: /routes/usuario.js
//   Movida en   : Lección 112 a : /middlewares/autenticacion.js (este archivo)
// ==============================================
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED; // Versión video Ok - 1/2
// var SEED = require('../config/config');       // Versión Owner Ok - 1/2

// Nueva versión del código original
exports.verificaToken = function(req, res, next) {
    var token = req.query.token; // Recupera los parámetros en la URL después de ?
    // var tester = req.query.tester; // Recupera los parámetros en la URL después de ?
    // return res.status(200).json({
    //     ok: true,
    //     msg: 'Token test only',
    //     token: token,
    //     tester: tester
    // });
    jwt.verify(token, SEED, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido',
                errors: err,
                seed: SEED,
                token: token,
                decoded: decoded
            });
        }
        // res.status(200).json({
        //     ok: true,
        //     msg: 'Token Ok',
        //     token: token,
        //     decoded: decoded,
        //     inicio: decoded.iat,
        //     expira: decoded.exp
        // });
        req.usuario = decoded.usuario;
        next();
    });
};


/********************************************************************************************
// Código original desde: /routes/usuario.js
// ==============================================
// Verificar Token - Implementando middleware - 2/2
//   Originada en: Lección 111 en: /routes/usuario.js
//   Movida en   : Lección 112 a : /middlewares/autenticacion.js (este archivo)
// ==============================================
// Versión con function
app.use('/', function(req, res, next) {
    var token = req.query.token;
    // return res.status(200).json({
    //     ok: true,
    //     msg: 'Token válido',
    //     token: token
    // });
    jwt.verify(token, SEED, function(err, decoded) { // Versión video Ok - 2/2
        // jwt.verify(token, SEED.SEED, function(err, decoded) { // Versión Owner Ok - 2/2
        // res.status(401).json({
        //     ok: false,
        //     msg: 'Token fail',
        //     errors: err,
        //     decoded: decoded
        // });
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no es válido',
                errors: err,
                token: token,
                decoded: decoded
            });
        }
        // decoded
        // return res.status(200).json({
        //     ok: false,
        //     msg: 'Token válido',
        //     errors: err,
        //     token: token,
        //     decoded: decoded
        // });
        // {
        //     "ok": false,
        //     "msg": "Token válido",
        //     "errors": null,
        //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJfaWQiOiI1ZTkxYWMyN2Q0ZGQzMzI3NDhmNGQ3ZjMiLCJub21icmUiOiJ0ZXN0MTAiLCJlbWFpbCI6InRlc3QxMEB0ZXN0MTAuY29tIiwicGFzc3dvcmQiOiI6KSIsIl9fdiI6MH0sImlhdCI6MTU4NjcxNzkzNCwiZXhwIjoxNTg2NzMyMzM0fQ.X8styWy1TgHedvp3p-eCASuP2GQuhV_LC8qsvbCkniM",
        //     "decoded": {
        //         "usuario": {
        //             "role": "USER_ROLE",
        //             "_id": "5e91ac27d4dd332748f4d7f3",
        //             "nombre": "test10",
        //             "email": "test10@test10.com",
        //             "password": ":)",
        //             "__v": 0
        //         },
        //         "iat": 1586717934,
        //         "exp": 1586732334
        //     }
        // }
        next();
    });
});
********************************************************************************************/



/*
// Versión con () => {}
app.use('/', (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {      // Versión video Ok - 2/2
    // jwt.verify(token, SEED.SEED, (err, decoded) => { // Versión Owner Ok - 2/2
    // jwt.verify(token, { SEED }, (err, decoded) => {  // No funciona en lugar de la versión owner
        if (err) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no válido',
                err: err,
                token: token,
                decoded: decoded
            });
        }
        next();
    });
});
*/