//  1. Requires (Importación de librerías ya sea de terceros o personalizadas para hacer algo)
var express = require('express'); //  1. Servidor express
var mongoose = require('mongoose'); //  5. Mongoose
var bodyParser = require('body-parser'); // body parser

//  2. Inicializar variables
var app = express();

// Body parser ( Middleware )
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//  6. Conexión a la base de datos
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, rep) => {
//         if (err) throw err;
//             console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
// });
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', function(err, res) {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
/*
//   //    Errores de ejemplo
//   // 1: Error: Invalid port (larger than 65535) with hostname
//   // 2: (node:15316) UnhandledPromiseRejectionWarning: 
//   //    MongoNetworkError: failed to connect to server [localhost:2701] on first connect 
//   //    [Error: connect ECONNREFUSED 127.0.0.1:2701
//   // 3: (node:4016) UnhandledPromiseRejectionWarning: Error: Slash in host identifier 
*/

// 4. Rutas
//    103. Implementaciòn de Middleware (Algo que se ejecuta antes de que se resuelvan otras rutas)
app.use('/login', loginRoutes); // Cuando algo coincida con '/usuario', usar: loginRoutes
app.use('/usuario', usuarioRoutes); // Cuando algo coincida con '/usuario', usar: usuarioRoutes
app.use('/', appRoutes); // Cuando algo coincida con '/', usar: appRoutes

/*
// ******************************************
// Begin - Bloq moved to routes/app.js
// ******************************************
// Versión con la palabra reservada function
app.get('/', function(req, res, next) {
    res.status(200).json({
        ok: true,
        msg: "Petición recibida correctamente"
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

// ******************************************
// End - Bloq moved to routes/app.js
// ******************************************
*/

// 3. Escuchar peticiones al puerto 3000
app.listen(3000, function() {
    console.log('Express server puerto 3000:\x1b[32m%s\x1b[0m', ' online');
});

//   Equivalente a la expresión de arriba
// app.listen(3000, () => {
//     // console.log('Express server puerto 3000 online');
//     console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
// });