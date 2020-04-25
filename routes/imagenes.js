var fs = require('fs');
var express = require('express');
var app = express();
// const path = require('path'); // Ok
var path = require('path'); // Cambiado a esto por compatibilidad del snippet

var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');


// ==============================================
// Devuelve el archivo de imagen
// URLs de prueba de la interfaz
//   OK:
// http://localhost:3000/img/hospitales/5e9a7f044cffea10c8e5b1d0-700.jpg
//   No imagen file
// http://localhost:3000/img/hospitales/5e9a7f044cffea10c8e5b1d0-701.jpg
//   Colección no reconocida
// http://localhost:3000/img/own/usuarios/5e94d6576e532a0264d97119-195.jpg
// ==============================================

app.get('/:coleccion/:imgName', function(req, res) {
    var coleccion = req.params.coleccion;
    var imgName = req.params.imgName;
    var colecciones = ['usuarios', 'hospitales', 'medicos'];
    if (colecciones.indexOf(coleccion) < 0) {
        var errMsg = `¡Colección no reconocida!. Las colecciones admitidas son: ${colecciones.join(', ')}`;
        return res.status(400).json({
            ok: false,
            msg: errMsg,
            errors: { message: errMsg }
        });
    }
    var pathImage = path.resolve(__dirname, `../uploads/${coleccion}/${imgName}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        pathImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathImage);
    }
});

// ==============================================
// Devuelve el archivo de imagen
// URLs de prueba de la interfaz
//   OK:
// http://localhost:3000/img/own/usuario/5e94d6576e532a0264d97119-195.jpg
// http://localhost:3000/img/own/usuario/5e94d6576e532a0264d97119-394.jpg
// http://localhost:3000/img/own/usuario/5e94d6576e532a0264d97119-516.jpg
//   No imagen file
// http://localhost:3000/img/own/usuario/nombreArchivoInexistente.jpg
//   Colección no reconocida
// http://localhost:3000/img/own/usuarios/5e94d6576e532a0264d97119-195.jpg
// ==============================================
app.get('/own/:coleccionItem/:imgName', function(req, res) {
    var item = req.params.coleccionItem;
    var imgName = req.params.imgName;
    var coleccion = ['usuario', 'hospital', 'medico'];
    var colecciones = ['usuarios', 'hospitales', 'medicos'];
    var elementoNdx = coleccion.indexOf(item);
    var filePath = `../../uploads/`;
    if (elementoNdx < 0) {
        var errMsg = `¡Colección no reconocida!. Las colecciones admitidas son: ${coleccion.join(', ')}`;
        return res.status(400).json({
            ok: false,
            msg: errMsg,
            errors: { message: errMsg }
        });
    }
    filePath += colecciones[elementoNdx] + '/' + imgName;
    imgName = path.resolve(__filename, filePath);
    if (!fs.existsSync(imgName)) {
        filePath = path.resolve(__filename, '../../assets/no-img.jpg');
    }
    imgName = path.resolve(__filename, filePath);
    res.sendFile(imgName);
});

module.exports = app;