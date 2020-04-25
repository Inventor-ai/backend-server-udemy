var fs = require('fs'); // fileSystem de node

var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

var Medicos = require('../models/medico');
var Usuarios = require('../models/usuario');
var Hospitales = require('../models/hospital');
// middleware
// default options
app.use(fileUpload());

app.get('/', function(req, res) {
    res.status(200).json({
        ok: true,
        msg: 'upload: GET method working ok'
    });
});

app.put('/:coleccion/:id', function(req, res) {
    var id = req.params.id;
    var coleccion = req.params.coleccion;

    // Lista de colecciones permitidas
    var lstCollect = ['hospitales', 'usuarios', 'medicos'];
    if (lstCollect.indexOf(coleccion) < 0) {
        return res.status(400).send({
            ok: false,
            msg: 'Colección no soportada.',
            errors: { message: 'Colecciones soportadas: ' + lstCollect.join(', ') }
        });
    }

    // Si no se proporcionó un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        // return res.status(400).send('No files were uploaded.');
        // return res.status(400).send('No se ha seleccionado nada.'); // Sólo devuelve el texto 
        return res.status(400).send({
            ok: false,
            msg: 'No se ha seleccionado nada.',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var cuttedFile = archivo.name.split('.');
    var extension = cuttedFile[cuttedFile.length - 1];

    // Lista de extensiones permitidas
    var extSoportadas = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
    if (extSoportadas.indexOf(extension) < 0) {
        return res.status(400).send({
            ok: false,
            msg: '¡Tipo de archivo no soportado!.',
            errors: { message: 'Tipos de archivos soportados: ' + extSoportadas.join(', ') },
            extension: extension,
            extSoportadas: extSoportadas
        });
    }

    // Ruta de carga de archivos
    // var ruta = './upload/' + coleccion + 123456789012345678901234-123 (id-123)
    var filename = `${id}-${new Date().getMilliseconds()}.${extension}`;
    var ruta = `./uploads/${coleccion}/${filename}`;

    archivo.mv(ruta, function(err) {
        if (err) {
            return res.status(500).send({
                ok: false,
                msg: '¡No se logró cargar el archivo!.',
                error: { message: 'Tipos de archivos soportados: ' + extSoportadas.join(', ') },
                errors: err,
                extension: extension,
                extSoportadas: extSoportadas
            });
        }
        subirArchivo(coleccion, id, filename, res);
        // return res.status(200).send({
        //     ok: true,
        //     msg: '¡Carga exitosa del archivo!.',
        //     extension: extension,
        //     extSoportadas: extSoportadas,
        //     destino: ruta + filename
        // });
    });

    /*
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
    */
    // res.status(200).json({
    //     ok: true,
    //     msg: 'upload: PUT method working ok',
    //     archivo: archivo.name,
    //     coleccion: coleccion,
    //     id: id,
    //     cuttedFile: cuttedFile,
    //     extension: extension,
    //     extSoportadas: extSoportadas,
    //     ruta: ruta
    // });
});

function subirArchivo(coleccion, id, filename, res) {
    if (coleccion === 'usuarios') {
        return setImagen(Usuarios, coleccion, id, filename, res); // ok
    }
    if (coleccion === 'hospitales') {
        return setImagen(Hospitales, coleccion, id, filename, res);
    }
    if (coleccion === 'medicos') {
        return setImagen(Medicos, coleccion, id, filename, res);
        // Medicos.findById(id, function(err, medico) {
        //     var oldImg = `./uploads/${coleccion}/${medico.img}`;
        //     if (fs.existsSync(oldImg)) {
        //         fs.unlinkSync(oldImg);
        //     }
        //     medico.img = filename;
        //     medico.save(function(dataErr, medicoActualizado) {
        //         if (dataErr) {
        //             return res.status(500).json({
        //                 ok: true,
        //                 msg: '¡Error de acceso al actualizar la imagen del médico!',
        //                 err: err
        //             });
        //         }
        //         return res.status(200).json({
        //             ok: true,
        //             msg: '¡Imagen actualizada con éxito!',
        //             medicoActualizado: medicoActualizado
        //         });
        //     });
        // });
    }
    // return res.status(200).send({
    //     ok: true,
    //     msg: '¡Carga exitosa del archivo!. =)',
    //     coleccion: coleccion,
    //     id: id,
    //     ruta: ruta
    //         //   extension: extension,
    //         //   extSoportadas: extSoportadas,
    //         //   destino: ruta + filename
    // });
}

function setImagen(modelo, coleccion, id, filename, res) {
    modelo.findById(id, function(err, data) {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: `¡Error al acceder a: ${coleccion}!`,
                errors: err
            });
        }
        if (!data) {
            fs.unlinkSync(`./uploads/${coleccion}/${filename}`);
            return res.status(400).json({
                ok: false,
                msg: `¡No existe el id: ${id}!`,
                errors: { message: '¡El Id no existe!' }
            });
        }
        if (data.img) {
            var oldImg = `./uploads/${coleccion}/${data.img}`;
            if (fs.existsSync(oldImg) != undefined) {
                fs.unlinkSync(oldImg);
            }
        }
        data.img = filename;
        data.save(function(dataErr, dataSaved) {
            if (dataErr) {
                return res.status(400).json({
                    ok: false,
                    msg: `¡Error al guardar datos en: ${coleccion}!`,
                    errors: dataErr
                });
            }
            if (coleccion === 'usuarios') {
                dataSaved.password = '=)';
            }
            return res.status(200).json({
                ok: true,
                msg: `Colección ${coleccion} actualizada con éxito!`,
                coleccion: coleccion,
                id: id,
                filename: filename,
                oldImg: oldImg,
                [coleccion]: dataSaved
            });
        });
    });
}

module.exports = app;

/*
Actualizacion del middleware
Jeimy · Clase 127 · hace 15 días
Chicos, para que funcione lo que explican en este video deben actualizar el codigo del middleware:

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// default options
app.use(fileUpload());
*/
// npm i express - fileupload
// http://localhost:3000/upload/medicos/5e9a87f5175c9f0b98074e2e