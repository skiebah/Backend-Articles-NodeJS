"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

mongoose.set("useFindAndModify", false); //Desactiva los metodos antiguos
mongoose.Promise = global.Promise; //Uso de promesas dentro de mongoDB
mongoose
  .connect("mongodb://localhost:27017/api_rest_articles", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("La conexion a la base de datos se ha realizado correctamente");

    //Crear servidor y ponerme a escuchar peticiones HTTP
    app.listen(port, () => {
        console.log('Servidor corriendo en HTTP//localhost:'+port);
    });
  });
