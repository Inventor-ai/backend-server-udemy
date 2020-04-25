var express = require('express');
var app = express();
var Medico = require('../models/medico');
var medicoCampo = 'nombre img usuario hospital';
var mdAutenticacion = require('../middlewares/autenticacion');

app.get('/', function(req, res) {
    var desde = req.query.desde;
    desde = Number(desde);
    var regs = req.query.regs;
    regs = Number(regs);
    Medico.find({}, medicoCampo)
        .skip(desde)
        .limit(regs)
        .populate('usuario')
        .populate('hospital')
        .exec(function(err, medicos) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: '¡Error de acceso a médicos!'
                });
            }
            Medico.countDocuments(function(err, conteo) {
                res.status(200).json({
                    ok: true,
                    msg: 'Listado de Médicos',
                    total: conteo,
                    datos: medicos
                });
            });
        });
});

app.post('/', mdAutenticacion.verificaToken, function(req, res) {
    var body = req.body;
    var medico = new Medico({
        img: body.img,
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save(function(err, datos) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: '¡Error de acceso a médicos!',
                body: body,
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            msg: '¡Médico agregado existosamente!',
            body: body,
            datos: datos,
            medico: medico
        });
    });
});

app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var body = req.body;
    var id = req.params.id;
    Medico.findById(id, function(err, medico) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso a médicos',
                err: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: '¡No se encontraron datos del médico!!!',
                err: err,
                id: id,
                body: body
            });
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        medico.save(function(err, medicoGuardado) {
            if (err) {
                res.status(500).json({
                    ok: false,
                    msg: '¡Error de acceso al guardar datos del médico!',
                    err: err,
                    id: id,
                    body: body,
                    medico: medico,
                    datos: medicoGuardado
                });
            }
            if (!medicoGuardado) {
                res.status(400).json({
                    ok: false,
                    msg: '¡Error al guardar datos del médico!',
                    err: { message: 'Error al guardardatos del médico' },
                    id: id,
                    body: body,
                    medico: medico,
                    datos: medicoGuardado
                });
            }
        });
        res.status(200).json({
            ok: true,
            msg: '¡Datos del médico actualizados exitosamente!',
            id: id,
            body: body,
            medico: medico
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, function(err, medicoBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: '¡Error de acceso al Médico!',
                datos: medicoBorrado,
                err: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                msg: '¡Médico no encontrado!',
                datos: medicoBorrado,
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            msg: '¡Médico borrado exitosamente',
            datos: medicoBorrado
        });
    });
});

/*
app.get('/', (req, res) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var regs = req.query.regs;
    regs = Number(regs);
    // Medico.find({}, (err, medicos) => {
    Medico.find({})
        .skip(desde)
        .limit(regs)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error de acceso a Médicos',
                    err: err
                });
            }
            // Medico.countDocuments( (conteo) => {
            Medico.countDocuments((err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    msg: 'Get Hospitales ok ()=>{}',
                    total: conteo,
                    datos: medicos
                });
            });
        });
});

// Add
// app.post('/', (req, res) => {
//     var tmp = { usuario: { _id: '123abc' } };
//     req.usuario = tmp;
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar el Médico. ()=>{}',
                body: body,
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            msg: 'Post Hospitales ok ()=>{}',
            body: body,
            guardado: medicoGuardado,
            usuario: req.usuario._id,
            hospital: body.hospital
        });
    });
});

// Update
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    Medico.findById(id, (errDB, medico) => {
        if (errDB) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al medico ()=>{}',
                err: errDB,
                body: body
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontraron datos de médico con el identificador ' + id + ' ()=>{}',
                err: errDB,
                id: id,
                medico: medico,
                body: body
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: '¡Error de actualización de datos del medico! ()=> {}',
                    body: body,
                    err: err
                });
            }
            if (!medicoGuardado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontraron datos el Médico con el identificador ' + id + ' ()=>{}',
                    err: { message: '¡No hay medicoes con el Id:' + id },
                    id: id,
                    medico: medico,
                    body: body
                });
            }
            return res.status(200).json({
                ok: true,
                msg: '¡Actualización exitosa de los datos del médico!',
                datos: medicoGuardado,
                body: body
            });
        });
    });
});

// Delete
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al Médico ()=>{}',
                id: id
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                msg: 'Médico no encontrado. Id: ' + id + ' ()=>{}',
                id: id
            });
        }
        res.status(200).json({
            ok: true,
            msg: '¡Médico borrado exitosamente! ()=>{}',
            datos: medicoBorrado,
            id: id
        });
    });
});
*/
module.exports = app;