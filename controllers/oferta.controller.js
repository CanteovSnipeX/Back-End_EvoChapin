var Oferta = require("../models/oferta.model");


function setOferta(req,res) {
var  params = req.body;
    if(params.name && params.products && params.fechaInicio && params.fechaFnalizacion){
        Oferta.findOne({name: params.nama} ,(err,ofertaFind) => {
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(ofertaFind){
                return res.send({message: "Oferta Creada"});
            }else{
                var oferta = new Oferta();
                oferta.name = params.name;
                oferta.fechaInicio = params.fechaInicio;
                oferta.fechaFnalizacion = params.fechaFnalizacion;
                oferta.products = parmas.products;
                oferta.save((err,ofertaSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al intentar agregar"});
                    }else if(ofertaSaved){
                        return res.send({message: "Creada exitosamente",categorySaved});
                    }else{
                        return res.status(404).send({message: "No se guardó"});
                    }
                }).populate('oferta')
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre)"})
    }   
}

function removeOferta(req, res) {
    
}

function getOferta(params) {
    
}

