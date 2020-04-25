var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var HospitalCampos = "nombre img usuario";
var mdAutenticacion = require('../middlewares/autenticacion');

// Lista Hospitales
app.get('/', function(req, res) {
    // Hospital.find({}, HospitalCampos) // Hasta Lección 120
    // A partir de la Lección 121
    var desde = req.query.desde || 0;
    desde = Number(desde);
    var regs = req.query.regs || 0;
    regs = Number(regs);
    Hospital.find({})
        .populate('usuario', 'nombre email') // , HospitalCampos
        .skip(desde)
        .limit(regs)
        .exec(function(err, hospitales) {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    msg: 'Error cargando hospital',
                    err: err
                });
            }
            Hospital.countDocuments(function(err, conteo) {
                res.status(200).json({
                    ok: true,
                    msg: 'Lista Hospitales',
                    total: conteo,
                    data: hospitales
                });
            });
        });
});

// Add
app.post('/', mdAutenticacion.verificaToken, function(req, res) {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save(function(err, hospitalGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar hospital',
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            msg: 'Hospital guardado',
            data: hospitalGuardado
        });
    });
});

// Update
app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var body = req.body;
    var id = req.params.id;
    Hospital.findById(id, function(errDb, hospital) {
        if (errDb) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al acceder al hospital',
                errDb: errDb,
                body: body
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un hospital con el id: ' + id,
                errDb: errDb,
                body: body,
                usuario: req.usuario
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        hospital.save(
            function(err, hospitalGuardado) {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'Error al actualizar los datos',
                        err: err,
                        body: body,
                        usuario: req.usuario
                    });
                }
                if (!hospitalGuardado) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No se encontraron datos el Hospital con el identificador ' + id + ' ()=>{}',
                        err: { message: '¡No hay hospitales con el Id:' + id },
                        id: id,
                        hospital: hospital,
                        body: body
                    });
                }
                res.status(200).json({
                    ok: true,
                    msg: '¡Datos del hospital actualizados exitosamente!',
                    body: body,
                    datos: hospitalGuardado,
                    usuario: req.usuario._id
                });
            }
        );
    });
});

// Delete
app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, function(err, hospitalBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al acceder al hospital para borrar',
                err: err,
                id: id
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró hospital con el Id: ' + id,
                id: id
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'Hospital ' + id + ' borrado.',
            hospital: hospitalBorrado,
            id: id,
            usuario: req.usuario._id
        });
    });
});


// Con funciones de flecha
// Lista de Hospitales
/*
app.get('/', (req, res) => {
    var desde = req.query.desde;
    desde = Number(desde);
    var regs = req.query.regs;
    regs = Number(regs);
    // Hospital.find({}, HospitalCampos)
    Hospital.find({})
        .skip(desde)
        .limit(regs)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error de acceso a Hospitales ()=>{}'
                });
            }
            Hospital.countDocuments((err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    msg: 'Get Hospitales ok ()=>{}',
                    total: conteo,
                    datos: hospitales
                });
            });
        });
});
*/
/*
// Add
// app.post('/', (req, res) => {
    //     var tmp = { usuario: { _id: '123abc' } };
    //     req.usuario = tmp;
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar el Hospital. ()=>{}',
                body: body,
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            msg: 'Post Hospitales ok ()=>{}',
            body: body,
            guardado: hospitalGuardado,
            usuario: req.usuario._id
        });
    });
});

// Update
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var id = req.params.id;
    Hospital.findById(id, (errDB, hospital) => {
        if (errDB) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al hospital ()=>{}',
                err: errDB,
                body: body
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontraron datos de hospital con el identificador ' + id + ' ()=>{}',
                err: errDB,
                id: id,
                hospital: hospital,
                body: body
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: '¡Error de actualización de datos del hospital! ()=> {}',
                    body: body,
                    err: err
                });
            }
            if (!hospitalGuardado) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se encontraron datos el Hospital con el identificador ' + id + ' ()=>{}',
                    err: { message: '¡No hay hospitales con el Id:' + id },
                    id: id,
                    hospital: hospital,
                    body: body
                });
            }
            return res.status(200).json({
                ok: true,
                msg: '¡Actualización exitosa de los datos del hospital!',
                datos: hospitalGuardado,
                body: body
            });
        });
    });
});

// Delete
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Error de acceso al Hospital ()=>{}',
                id: id
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'Hospital no encontrado. Id: ' + id + ' ()=>{}',
                id: id
            });
        }
        res.status(200).json({
            ok: true,
            msg: 'Delete Hospitales ok ()=>{}',
            datos: hospital,
            id: id
        });
    });
});
*/

module.exports = app;