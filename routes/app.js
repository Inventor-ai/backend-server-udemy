var express = require('express');
var app = express();

// 4. Rutas
// Versión con la palabra reservada function
app.get('/', function(req, res, next) {
    res.status(200).json({
        ok: true,
        msg: "Petición recibida correctamente"
            // req: req
    });
});
// Equivalentes a la de arriba pero en versión función de flecha
// app.get ('/', (request, response, next) => {}); // Versión larga
// app.get ('/', (req , res, next) => {});         // Versión corta (La más uasada)

// app.get('/', (request, response, next) => {
//     response.status(200).json({
//         ok: true,
//         msg: 'Petición realizada correctamente'
//     });
// });

// app.post('/', function(req, res, nxt) {
// app.post('/', function(req, res) {
//     res.status(200).json({
//         ok: true,
//         msg: 'Petición POST ok'
//     });
// });

// app.post('/', (req, res) => {
//     res.status(200).json({
//         ok: true,
//         msg: 'Petición POST de flecha ok'
//     });
// });

// app.put('/', function (params) {
// } );

module.exports = app;