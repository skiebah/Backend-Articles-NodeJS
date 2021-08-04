'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
var Article = require('../models/article');


var controller = {
    datosApi: (req, res) =>{
        return res.status(200).send({
            api: 'Backend Articles - NodeJS',
            version: '1.0.0'
         });
    },

    test: (req, res) =>{
        return res.status(200).send({
            message: 'Test Controller Articles'
        });
    }, 

    save: (req, res) =>{
        // recoger los parametros por POST
        var params = req.body;

        // validar los datos con VALIDATOR
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }

        if(validate_title && validate_content){
            // Crear el objeto a guardar
            var article = new Article();
        
            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulo
            article.save((err, articleStored) =>{
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }
                
                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            })
        }
    },

    getArticles: (req, res) =>{
        var query = Article.find({});
        var last = req.params.last;
        
        if(last || last != undefined){
            query.limit(2);
        }
        //find
        query.sort('-_id').exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articles'
                });
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articles disponibles'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req, res) =>{
        // recoger el id de la URL
        var articleId = req.params.id;
        
        // Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el article'
            });
        }
        // Buscar el articulo
        Article.findById(articleId, (err, article)=>{
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'Error no se encuentra el article'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });
        });
        // Devolver el JSON
    },

    update: (req, res) =>{
        // recoger el id del articulo por la URL
        var articleId = req.params.id;
        
        // recoger los datos que llegar por PUT
        var params = req.body;
        
        // Find and Update
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);


        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por recibir'
            });
        }

        if(validate_title && validate_content){
            // Find and update
            Article.findByIdAndUpdate({_id: articleId}, params,{new:true}, (err, articleUpdated)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el Article'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    delete: (req, res) =>{
        // recoger el ID de la URL
        var articleId = req.params.id;

        // Find and Delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado existe el article a borrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },

    upload: (req, res)=>{
        // Configurar el modulo connect multipart router/article.js

        // recoger el fichero de la peticion
        var file_name = 'Imagen no Subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        
        //conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // ** ADVERTENCIA ** EN linux o MAC
        // var file_split = file_pat.split('/');

        // Nombre del archivo
        var file_name = file_split[2];
        // extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // comprobar la extension, solo imagenes, y si no es valido borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif' && file_ext != 'jpeg'){
            //Borrar el file
            fs.unlink(file_path, (err) =>{
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension del file no es valida'
                });
            });
        }else{
            // si todo es validdo
            var articleId = req.params.id;
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated)=>{
                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            })
            
        }
    },

    getImage: (req, res)=>{
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res)=>{

        // Sacar el string a buscar
        var searchString = req.params.search;
        // find or
        Article.find({ "$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) =>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articles que coincidan con tu busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })

        
    }
}; // END Controller

module.exports = controller;