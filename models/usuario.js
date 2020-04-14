// 1. Importaciones y declaraciones
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
// Objeto JavaScript c/configuración con el esquema para cada registro
// Configuración del registro en formato JSON

// Validación de roles
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: false, default: 'USER_ROLE', enum: rolesValidos }
});

// Reemplaza el error por el texto
// usuarioSchema.plugin(uniqueValidator, { message: 'El correo debe ser único' });

// Aplica el reemplazo al tipo de error y lo completa con el texto
usuarioSchema.plugin(uniqueValidator, { message: 'El valor en {PATH} debe ser único' });

// Para poder usar este modelo en los servicios es necesario exportarlo
module.exports = mongoose.model('Usuario', usuarioSchema);
// Parece que el 'Nombre_del_recurso' con el que se comparte es en realidad 
// el nombre de la colección "Collection" -tabla- a la que se acocia el Esquema