var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

// ==============================================
// Verificar Token - Implementando middleware - 1/2
//   Originada en: Lección 111 en: /routes/usuario.js (este archivo)
//   Movida en   : Lección 112 a : /middlewares/autenticacion.js
// ==============================================
/*
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED; // Versión video Ok - 1/2
// var SEED = require('../config/config');   // Versión Owner Ok - 1/2
*/
// ==============================================
// Versión desde 112
// ==============================================
var mdAutenticacion = require('../middlewares/autenticacion');
// app.use(bodyParser.urlencoded({ extended: false }));
// var bodyParser = require('body-parser'); // body parser
var mdDataUsuario = require('../middlewares/datausuario'); // Owner middleware
// app.use(bodyParser.json()); // parse application/json

// Lista de todos: Devolver todos los usuarios
// Verificar Token
// Agregar       : Crear un nuevo usuario - POST
// Actualizar    : 
// Borrar        : Borrar un usuario por el Id

// ==============================================
// Devolver todos los usuarios
// ==============================================
// Versión con function
/*
// 1. Con tres parámetros en el .find()
// app.get('/', function(request, response, next) { // Devuelve todos los registros
//     // Todos los campos
//     // Usuario.find({}, function(error, data) {
//     // Solo los campos: '_id nombre email role img'
//     Usuario.find({}, '_id nombre email role img', function(error, data) {
//       if (error) {
//           return response.status(500).json({
//               ok: false,
//               msg: 'Error en base de datos Usuarios',
//               errors: error
//           });
//       }
//       response.status(200).json({
//           ok: true,
//           msg: "Usuarios",
//           usuarios: data
//       });
//     });
// });
*/
// 2. Con dos parámetros en el .find() y agregando el método .exec
app.get('/', function(request, response, next) { // Devuelve todos los registros
    // Todos los campos
    // Usuario.find({}, function(error, data) {
    // Solo los campos: '_id nombre email role img'
    var desde = request.query.desde || 0;
    desde = Number(desde);
    var regs = request.query.regs || 0; // 0: Todos
    regs = Number(regs);
    Usuario.find({}, '_id nombre email role img')
        .skip(desde)
        // .limit(5)
        .limit(regs)
        .exec(function(error, data) {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    msg: 'Error en base de datos Usuarios',
                    errors: error
                });
            }
            // Usuario.count({}, function(err, conteo) {
            Usuario.countDocuments(function(err, conteo) {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        msg: "Error de acceso al contar usuarios",
                        total: conteo,
                        usuarios: data
                    });
                }
                response.status(200).json({
                    ok: true,
                    msg: "Usuarios",
                    total: conteo,
                    usuarios: data
                });
            });
        });
});

// Equivalentes a la de arriba pero en versión función de flecha
// app.get ('/', (request, response, next) => {}); // Versión larga
// app.get ('/', (req , res, next) => {});         // Versión corta (La más uasada)
// 1. Con tres parámetros en el .find()
/*
app.get('/', (request, response, next) => {
    Usuario.find({}, '_id nombre email role img', (err, data) => {
        if (err) {
            return response.status(500).json({
                ok: true,
                msg: "Falla en base de datos de usuarios",
                errors: err
            });
        }
        // response.status(200).json({
        //     ok: true,
        //     msg: "Usuarios",
        //     usuarios: data
        // });
    });
});
*/

// 2. Con dos parámetros en el .find() y agregando el método .exec
/*
app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var regs = req.query.regs || 0;
    regs = Number(regs);
    Usuario.find({}, '_id nombre email role img')
        .skip(desde)
        .limit(regs)
        .exec(
            (err, data) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        msg: "Error en base de datos usuarios",
                        errors: err
                    });
                }
                // Usuario.count({}, (err, conteo) => {
                Usuario.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: "Error de acceso al contar usuarios",
                            usuarios: data
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        msg: "Usuarios",
                        total: conteo,
                        usuarios: data
                    });
                });
                // res.status(200).json({
                //     ok: true,
                //     msg: 'usuarios',
                //     usuarios: data
                // });
            }
        );
});
*/

// ==============================================
// Verificar Token - Implementando middleware
//   Originada en: Lección 111 en: /routes/usuario.js (este archivo)
//   Movida en   : Lección 112 a : /middlewares/autenticacion.js
// ==============================================


// ==============================================
// Crear un nuevo usuario - POST
// ==============================================
// 1. Con function 
// app.post('/', function(req, res) {  // Versión ok hasta Lección 111
// app.post('/', mdAutenticacion.verificaToken, function(req, res) {  // Versión desde 112
app.post('/', [mdAutenticacion.verificaToken, mdDataUsuario.isPasswordOk], function(req, res) { // Own Version
    var body = req.body; // Agregar f(x) para validar datos en campos ok
    // var test = doCheckSquema(req, res); // Función a nivel de IDEA v.2
    // Bloque demo - Inicio
    // var test = doCheckSquema(req, Usuario);  // Función a nivel de IDEA v.1
    // Bloque demo - Fin

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // password: body.password, // Temporalmente xq DEBE encriptarse antes de guardarse
        // Si body.password está vacío, bcrypt produce un error de ejecución por eso se implementó
        // el middleware mdDataUsuario.isPasswordOk - Owner
        password: (bcrypt.hashSync(body.password, 10)),
        img: body.img,
        role: body.role
    });

    usuario.save(function(err, usuarioGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear el usuario',
                errors: err,
                body: body,
                ret: usuarioGuardado
            });
        }
        res.status(201).json({
            ok: true,
            msg: usuarioGuardado,
            ret: "Petición POST usuarios ok f(x)",
            body: body,
            usuarioToken: req.usuario
        });
    });
});


/*
// 2. Con f(X)=> {}
// app.post('/', (req, res) => {  // Versión ok hasta Lección 111
// app.post('/', mdAutenticacion.verificaToken, (req, res) => {  // Versión desde 112
app.post('/', [mdAutenticacion.verificaToken, mdDataUsuario.isPasswordOk], (req, res) => { // Own Version
    var body = req.body;
    // var test = doCheckSquema(req, res); // Implementar a nivel de middleware
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // password: body.password, // Temporalmente xq DEBE encriptarse antes de guardarse
        password: (bcrypt.hashSync(body.password, 10)),
        img: body.img,
        role: body.role
    });
    // En lugar de res se usó usuarioGuardado
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: "Error al crear el usuario",
                errors: err,
                body: body,
                ret: usuarioGuardado
            });
        }
        res.status(201).json({
            ok: true,
            msg: usuarioGuardado,
            ret: "Petición POST usuarios flecha ok",
            body: body
        });
    });
});
*/

// app.put('', function(req, res) {
//     var body = req.body;
//     res.status(400).json({
//         ok: false,
//         msg: 'No se proporcionaron los datos necesarios para esta acción',
//         err: { errors: 'No se proporcionaron los datos necesarios para esta acción' },
//         body: body
//     });
// });

/*
app.put('', (req, res) => {
    var body = req.body;
    res.status(400).json({
        ok: false,
        msg: 'No se proporcionaron los datos necesarios para esta acción () => {}',
        errors: { error: 'No se proporcionaron los datos necesarios para esta acción () => {}' },
        body: body
    })
});
*/
// ==============================================
// Actualizar
// ==============================================
// 3. 
// app.put('/:id', function(req, res) { // Versión ok hasta Lección 111
app.put('/:id', mdAutenticacion.verificaToken, function(req, res) { // Versión desde 112
    // Versión desde 112
    var body = req.body;
    var id = req.params.id;
    // return res.status(200).json({
    //     ok: true,
    //     msg: 'Actualización concluida',
    //     // errors: usuarioGuardado,
    //     body: body,
    //     id: id
    // });
    Usuario.findById(id, function(err, usuario) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar al usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                // msg: 'No se encontró el id ' + id + ' del usuario',
                msg: '¡El usuario con el id ' + id + ' no existe!',
                errors: { errors: 'No existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save(function(err, usuarioGuardado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al actualizar el usuario. f(x)',
                    errors: err
                });
            }
            if (!usuarioGuardado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al guardar el usuario PUT f(x)',
                    errors: usuarioGuardado,
                    body: body,
                    id: id
                });
            }
            usuarioGuardado.password = ":)";
            res.status(200).json({
                ok: true,
                msg: 'Actualización exitosa',
                errors: usuarioGuardado,
                body: body,
                id: id
            });
        });
    });
});

/*
// 3. Con f(X)=> {}
// app.put('/:id', (req, res) => { // Versión ok hasta Lección 111
app.put('/:id', mdAutenticacion.verificaToken, (req, res) =>  { // Versión desde 112
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al buscar al usuario. ()=> {}',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                //  msg: ' Usuario no encontrado. ()=> {}',
                msg: 'El usuario con el id ' + id + ' ¡no exixste!. ()=> {}',
                errors: { errors: '¡No existe un usuario con ese Id. ()=> {}' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actualizar el usuario. ()=> {}',
                    errors: err
                });
            }
            if (!usuarioGuardado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al guardar el usuario PUT f(x)',
                    errors: usuarioGuardado,
                    body: body,
                    id: id
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                msg: 'Actualización exitosa. ()=> {}',
                errors: usuarioGuardado,
                body: body,
                id: id
            });
        });
    });
    // res.status(200).json({
    //     ok: true,
    //     msg: 'usuarios PUT ()=>{} Ok',
    //     body: body,
    //     id: id
    // });
});
*/

// ==============================================
// Borrar un usuario por el Id
// ==============================================
// 4. Borrar con function 
// app.delete('/:id', function(req, res) {  // Versión ok hasta Lección 111
app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) { // Versión desde 112
    var id = req.params.id;
    var body = req.body;
    Usuario.findByIdAndRemove(id, function(err, usuarioBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al borrar usuario',
                errors: err,
                data: usuarioBorrado,
                body: body,
                id: id
            });
        }
        if (!usuarioBorrado) { // Revisar notas en apunte de la lección 108
            return res.status(400).json({
                ok: false,
                msg: '¡Usuario no encontrado!',
                errors: { message: 'No existe usuario con ese Id' },
                errores: err,
                data: usuarioBorrado,
                body: body,
                id: id
            });
        }
        usuarioBorrado.password = ":)";
        res.status(200).json({
            ok: true,
            msg: 'Usuario borrado exitosamente',
            errores: err,
            data: usuarioBorrado,
            body: body,
            id: id
        });
    });
});


/*
// 4. Borrar con f(X)=> {}
// app.delete('/:id', (req, res) => {  // Versión ok hasta Lección 111
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {    // Versión desde 112
    var id = req.params.id;
    var body = res.body;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al borrar usuario. () => {}',
                errors: err,
                data: usuarioBorrado,
                body: body,
                id: id
            });
        }
        if (!usuarioBorrado) { // Revisar notas en apunte de la lección 108
            return res.status(400).json({
                ok: false,
                msg: '¡Usuario no encontrado!. () => {}',
                errors: { message: 'No existe usuario con ese Id'},
                errores: err,
                data: usuarioBorrado,
                body: body,
                id: id
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Usuario borrado exitosamente! -> Delete ()=>{} Test Ok',
            errors: err,
            data: usuarioBorrado,
            body: body,
            id: id
        });
    });
});
*/

module.exports = app;