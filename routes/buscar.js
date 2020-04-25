/*
// Next line imports function to implement here
const { buscarMedicosOwn } = require("./buscarMedicosOwn");

// Other file contents: buscarMedicosOwn.js
function buscarMedicosOwn(buscar, expReg) {
    return new Promise(function (resolve, reject) {
        // code here....
    });
}
exports.buscarMedicosOwn = buscarMedicosOwn;
*/

var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


app.get('/todo/:buscar', function(req, res) {
    var buscar = req.params.buscar;
    var expReg = new RegExp(buscar, 'i');

    // Función original para probar el servicio
    // Hospital.find({ nombre: expReg }, function(err, hospitales) {
    //     if (err) {
    //         res.status(500).json({
    //             ok: false,
    //             msg: 'Error de acceso a Hospitales',
    //             err: err
    //         });
    //     }
    //     res.status(200).json({
    //         ok: true,
    //         msg: 'Buscar response ok',
    //         buscar: buscar,
    //         data: hospitales
    //     });
    // });

    // Probar incorporación del servicio en una promesa
    // buscarHospitales(buscar, expReg).then(
    //     function(hospitales) {
    //         res.status(200).json({
    //             ok: true,
    //             msg: 'Buscar response ok',
    //             data: hospitales
    //         });
    //     }
    // );
    /*
        .then(function(datos) {
            res.status(200).json({
                ok: true,
                msg: 'Resultados',
                hospitales: datos[0],
                medicos: datos[1],
                usuarios: datos[2],
                usuariosX: datos[3]
            });
    */

    Promise.all([buscarHospitales(Hospital, expReg),
            // buscarHospitales(expReg),
            // buscarDatos(Hospital, expReg),
            buscarMedicosOwn(Medico, expReg), // antes: buscarDatos
            // buscarDatos(Usuario, expReg),
            buscarUsuarios(Usuario, expReg)
        ])
        .then(function(datos) {
            res.status(200).json({
                ok: true,
                msg: 'Resultados',
                hospitales: datos[0],
                medicos: datos[1],
                usuarios: datos[2]
            });
        });

    // buscarDatos(Medico, expReg).then(
    //     function(datos) {
    //         res.status(200).json({
    //             ok: true,
    //             msg: 'Buscar response ok',
    //             data: datos
    //         });
    //     }
    // );
});

app.get('/medico/:medico', function(req, res) {
    var buscar = req.params.medico;
    var expReg = new RegExp(buscar, 'i');
    buscarMedicosOwn(Medico, expReg).then(function(medicos) {
        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda:',
            medicos: medicos
        });
    });
});

app.get('/hospital/:hospital', function(req, res) {
    var buscar = req.params.hospital;
    var expReg = new RegExp(buscar, 'i');
    // buscarHospitales(expReg).then(function(hospitales) {
    buscarHospitales(Hospital, expReg).then(function(hospitales) {
        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda:',
            hospitales: hospitales
        });
    });
});

app.get('/usuario/:usuario', function(req, res) {
    var buscar = req.params.usuario;
    var expReg = new RegExp(buscar, 'i');
    buscarUsuarios(Usuario, expReg).then(function(usuarios) {
        res.status(200).json({
            ok: true,
            msg: 'Resultado de la búsqueda:',
            usuarios: usuarios
        });
    });
});

// function buscarHospitales(expReg) {
function buscarHospitales(buscar, expReg) {
    return new Promise(function(resolve, reject) {
        // Hospital.find({ nombre: expReg }, function(err, hospitales) {
        buscar.find({ nombre: expReg })
            // .populate('hospital')
            .populate('usuario', 'nombre email')
            .exec(
                function(err, hospitales) {
                    if (err) {
                        reject('Error de acceso a Hospitales', err);
                    } else {
                        resolve(hospitales);
                    }
                });
    });
}

function buscarUsuarios(buscar, expReg) {
    return new Promise(function(resolve, reject) {
        // buscar.find({ nombre: expReg }, function(err, hospitales) {
        buscar.find({}, "role nombre email")
            .or([{ 'nombre': expReg }, { 'email': expReg }])
            .exec(
                function(err, usuarios) {
                    if (err) {
                        reject('Error al cargar usuarios', err);
                    } else {
                        resolve(usuarios);
                    }
                }
            );
    });
}

function buscarMedicosOwn(buscar, expReg) {
    return new Promise(function(resolve, reject) {
        buscar.find({ nombre: expReg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec(function(err, datos) {
                if (err) {
                    reject('Error de acceso a Médicos', err);
                } else {
                    resolve(datos);
                }
            });
    });
}

// ====================================================
// Segunda propuesta personal a la tarea del video
// La primera son get's independientes p/cada colección
// ====================================================
app.get('/tabla/:coleccion/:buscar', function(req, res) {
    var coleccion = req.params.coleccion;
    var buscar = req.params.buscar;
    var expReg = new RegExp(buscar, 'i');
    var promes;
    var Schema;
    switch (coleccion) {
        case 'usuarios':
            promes = buscarUsuarios;
            Schema = Usuario;
            break;
        case 'hospitales':
            promes = buscarHospitales;
            Schema = Hospital;
            break;
        case 'medicos':
            promes = buscarMedicosOwn;
            Schema = Medico;
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Sólo pueden hacerse búsquedas por: usuarios, hospitales o medicos',
                error: { message: 'Colección desconocida: ' + coleccion }
            });
            // break;
    }
    promes(Schema, expReg).then(function(datos) {
        res.status(200).json({
            ok: true,
            msg: 'Buscando ' + coleccion,
            buscar: buscar,
            [coleccion]: datos
        });
    });
});

// ====================================================
// Segunda propuesta personal a la tarea del video
// La primera son get's independientes p/cada colección
// ====================================================
app.get('/coleccion/:tabla/:buscar', function(req, res) {
    var tabla = req.params.tabla;
    var buscar = req.params.buscar;
    var expReg = new RegExp(buscar, 'i');
    var promes;
    switch (tabla) {
        case 'usuarios':
            promes = buscarUsuarios(Usuario, expReg);
            break;
        case 'hospitales':
            promes = buscarHospitales(Hospital, expReg);
            break;
        case 'medicos':
            promes = buscarMedicosOwn(Medico, expReg);
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Sólo pueden hacerse búsquedas por: usuarios, hospitales o medicos',
                error: { message: 'Colección desconocida: ' + tabla }
            });
            // break;
    }
    promes.then(function(datos) {
        res.status(200).json({
            ok: true,
            msg: 'Buscando ' + tabla,
            buscar: buscar,
            [tabla]: datos
        });
    });
});


module.exports = app;