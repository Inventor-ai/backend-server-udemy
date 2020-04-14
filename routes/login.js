var express = require('express');
var bcript = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config');

// Versión con function
// 1. 
app.post('/', function(request, response) {
    var body = request.body;
    Usuario.findOne({ email: body.email }, function(err, usuarioDB) {
        // return response.status(500).json({
        //     ok: false,
        //     msg: "Verificación de datos",
        //     errors: err,
        //     body: body,
        //     data: usuarioDB
        // });

        if (err) {
            return response.status(500).json({
                ok: false,
                msg: "Error al buscar el usuario",
                errors: err,
                body: body,
                data: usuarioDB
            });
        }
        if (!usuarioDB) {
            return response.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas - email",
                errors: err,
                body: body,
                data: usuarioDB
            });
        }
        if (!body.password) {
            return response.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas - password vacio",
                errors: { message: 'Credenciales incorrectas' },
                body: body,
                data: usuarioDB
            });
        }
        if (!bcript.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas - password",
                errors: { message: 'Credenciales incorrectas' },
                body: body,
                data: usuarioDB
            });
        }
        // JWT - Crear el token
        usuarioDB.password = ":)"; // Para no mandar la contraseña en el token
        var token = jwt.sign({ usuario: usuarioDB }, // Payload
            // 'HS256', // Seed
            // '@este-es@-un-seed-difícil', // Seed
            SEED.SEED, { expiresIn: 14400 }); // Duración de 4 horas

        response.status(200).json({
            ok: true,
            msg: 'Usuario logeado exitosamente',
            usuarioDB: usuarioDB,
            id: usuarioDB._id,
            token: token
        });
    });
});

// () => {}
// app.post('/', (request, response) => {
//     var body = request.body;
//     Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
//         if (err) {
//             return response.status(500).json({
//                 ok: false,
//                 msg: "Error al buscar el usuario () => {}",
//                 errors: err,
//                 body: body,
//                 data: usuarioDB
//             });
//         }
//         if (!usuarioDB) {
//             return response.status(400).json({
//                 ok: false,
//                 msg: "Credenciales incorrectas - email () => {}",
//                 errors: err,
//                 data: usuarioDB
//             });
//         }
//         if (!body.password) {
//             return response.status(400).json({
//                 ok: false,
//                 msg: "Credenciales incorrectas - password vacio () => {}",
//                 errors: { message: 'Credenciales incorrectas' },
//                 body: body,
//                 data: usuarioDB
//             });
//         }
//         if (!bcript.compareSync(body.password, usuarioDB.password)) {
//             return response.status(400).json({
//                 ok: false,
//                 msg: "Credenciales incorrectas - password () => {}",
//                 errors: { message: 'Credenciales incorrectas' },
//                 body: body,
//                 data: usuarioDB
//             });
//         }
//         // JWT
//         response.status(200).json({
//             ok: true,
//             usuarioDB: usuarioDB,
//             id: usuarioDB._id,
//             msg: 'Usuario logeado'
//         });
//     });
// });

module.exports = app;