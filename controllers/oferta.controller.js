var Oferta = require("../models/oferta.model");
var Product = require("../models/product.model");


function setOferta(req,res) {
var  params = req.body;

    if(params.name  && params.fechaInicio && params.fechaFnalizacion){
        Oferta.findOne({name: params.name} ,(err,ofertaFind) => {
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(ofertaFind){
                return res.send({message: "Oferta ya existente"});
            }else{
                var oferta = new Oferta();
                oferta.name = params.name;
                oferta.fechaInicio = params.fechaInicio;
                oferta.fechaFnalizacion = params.fechaFnalizacion;
                oferta.save((err,ofertaSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al intentar agregar"});
                    }else if(ofertaSaved){
                        return res.send({message: "Creada exitosamente",ofertaSaved});
                    }else{
                        return res.status(404).send({message: "No se guardó"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos"})
    }   
}

function setProductOferta(req, res){
    var ofertaId = req.params.idO;
    var productoId = req.params.idP;
    
}

function removeOferta(req, res) {   
    let ofertaId = req.params.id;

            Oferta.findByIdAndRemove(ofertaId, (err,ofertaRemove)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al eliminar'});
                }else if(ofertaRemove){
                    return res.send({message: 'Oferta eliminado', ofertaRemove});
                }else{
                    return res.status(403).send({message: 'Usuario no eliminado'});
                }
     })
}

function getOferta(req, res) {

    
}

module.exports = {
    setOferta,
    removeOferta,
    getOferta
}
