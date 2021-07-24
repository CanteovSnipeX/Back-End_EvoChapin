"use strict"

var Comment = require("../models/comment.model");

function Comment(req, res) {
        var comment = new Comment();
        var params = req.body;

        if(params.typecomment){
            comment.typecomment = params.typecomment;
            comment.comment = params.comment;
            comment.save((err,savedComment)=>{
                if(err){
                    return res.status(500).send({message: "Error al agregar"});
                }else if(savedComment){
                    return res.send({message: "Gracias por tu opinion",savedComment});
                }else{
                    return res.status(404).send({message: "No al mandar el comentario"});
                }
            })
        }else{
            return res.status(403).send({message: "Ingrese los datos mínimos"});
        }
}


function removeComment(req, res) {
    let commentId =  req.params.id;
            Comment.findByIdAndRemove(commentId,(err,productRemoved)=>{
                if(err){
                    return res.status(500).send({message: "Error al eliminar producto"});
                }else if(productRemoved){
                    return res.send({message: "Comentario eliminado exitosamente"});
                }else{
                    return res.status(403).send({message: "No se eliminó"});
               }
    })
}

function getComment(req, res) {
    Comment.find({}).populate('comment').exec((err,comment)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'})
        }else if (comment){
            return res.send({message: 'Comentarios: ', comment})

        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

module.exports = {
    Comment,
    getComment,
    removeComment
}
