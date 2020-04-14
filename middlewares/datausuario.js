// Esto no viene en el video. Es sólo una idea que implementada para
// evitar que se produzcan RUN-TIME ERRORS controlando los datos 

// Validar contenido de datos en los campos según su esquema
// var body = req.body;  // Agregar f(x) para validar datos en campos ok
// module.exports.isPasswordOk = function(req, res, next) {

exports.isPasswordOk = function(req, res, next) {
    // Recupera los parámetros en la URL después de ?
    var token = req.query.token;
    var tester = req.query.tester;
    var body = req.body;
    if (!body.password) {
        return res.status(401).json({
            ok: false,
            msg: 'Falta la contraseña',
            errors: { message: 'DEBE proporcionarse la contraseña' }
        });
    }
    next();
    // Incluir todas las reglas de validación de datos aquí
};

module.exports.isDataOk = function(dataSet) {
    // Validacion de datos según esquema / accion / módulo?
    // { dataSet : dataSet,
    //   action  : 'xxx ... yyy' }
    // Temporalmente para hacer pruebas devuelve un boolean
    return true;
    // return false;
};

// En base a lo anterior, revisar la sihuiente idea:
/*================================
// function doCheckSquema(request, esquema) {
    function doCheckSquema(req, res) {
        if (!req.body.password) { // 
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear el usuario',
                "errors": {
                    "errors": {
                        "password": {
                            "message": "La contraseña es necesaria",
                            "name": "ValidatorError",
                            "properties": {
                                "message": "La contraseña es necesaria",
                                "type": "required",
                                "path": "password"
                            },
                            "kind": "required",
                            "path": "password"
                        }
                    },
                    "_message": "Usuario validation failed",
                    "message": "Usuario validation failed: password: La contraseña es necesaria",
                    "name": "ValidationError"
                },
                body: req.body
            });
        }
        // return {
        //     fxName: 'doCheckSquema',
        //     ask2U: '¿Hay manera de leer el esquema y compararlo con los datos de entrada?',
        //     body: request.body,
        //     data: request.data,
        //     type: esquema.collection.collectionName
        //         // type: new esquema()
        // };
    }
================================ */