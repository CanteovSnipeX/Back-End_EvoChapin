"use strict"

var Category = require("../models/category.model");
var fs = require('fs');
var path = require('path');

function deafultCategory(){
    var nombre = "Default"
    Category.findOne({name: nombre},(err,categoryFind)=>{
        if(err){
            console.log("Error al buscar",err);
        }else if(categoryFind){
            console.log("Categoría default ya existente");
        }else{
            var category = new Category();
            category.name = "Default";
            category.save((err,categorySaved)=>{
                if(err){
                    console.log("Error al intentar agregar");
                }else if(categorySaved){
                    console.log("Categoría default creada");
                }else{
                    console.log("No se creó la categoría Default");
                }
            })
        }
    })
}


function uploadImageCategory(req, res){
    let categoryId = req.params.idC;
    var update = req.body;
    var fileName;

   
        if(req.files){

            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){

                    Category.findByIdAndUpdate(categoryId, {image:fileName},{new:true}, (err, teamUpdate) => {
                                if(err){
                                    return res.status(500).send({message: 'Error general en la actualización'});
                                }else if(teamUpdate){
                                    return res.send({message: 'Category actualizado', teamUpdate});
                                }else{
                                    return res.status(404).send({message: 'Category no actualizado'});
                                }
                            }) 
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                        }else{
                            res.send({message: 'Extensión no válida'})
                        }
                    })
                }
        }else{
            res.status(400).send({message: 'No has enviado imagen a subir'})
        }
}


function getImageCategory(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/category/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function createCategory(req,res){
    var params = req.body;
    
    if(params.name){
        Category.findOne({name: params.name},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                return res.send({message: "Categoría ya existente"});
            }else{
                var category = new Category();
                category.name = params.name;
                category.save((err,categorySaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al intentar agregar"});
                    }else if(categorySaved){
                        return res.send({message: "Categoría creada exitosamente",categorySaved});
                    }else{
                        return res.status(404).send({message: "No se guardó"});
                    }
                })
            }
        }).populate('category');
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre)"})
    }
}

function updateCategory(req,res){
    let categoryId = req.params.id;
    let update = req.body;

    if(update.name){
        Category.findOne({name: update.name},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                return res.send({message: "Nombre de categoría ya existente"});
            }else{
                Category.findByIdAndUpdate(categoryId,update,{new:true},(err,categoryUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al actualizar"});
                    }else if(categoryUpdated){
                        return res.send({message: "Categoría actualizada exitosamente",categoryUpdated});
                    }else{
                        return res.status(500).send({message: "No se actualizó"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el nuevo nombre de categoría"});
    }
}

function removeCategory(req,res){
    let categoryId = req.params.id;

    Category.findOne({_id : categoryId},(err,categoryFind)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar"});
        }else if(categoryFind){
            var productos = categoryFind.products;
            Category.findOneAndUpdate({name: "Default"},{$push:{products:productos}},{new: true},(err,categoryUpdated)=>{
                if(err){
                    return res.status(500).send({message: "Error al actualizar"});
                }else if(categoryUpdated){
                    Category.findOne({_id : categoryId},(err,categoryFind)=>{
                        if(err){
                            return res.status(500).send({message: "Error al buscar"});
                        }else if(categoryFind){
                            Category.findByIdAndRemove(categoryId,(err,categoryRemoved)=>{
                                if(err){
                                    return res.status(500).send({message: "Error al eliminar"});
                                }else if(categoryRemoved){
                                    return res.send({message: "Categoría eliminada exitosamente", categoryRemoved});
                                }else{
                                    return res.status(404).send({message: "No se eliminó"});
                                }
                            })
                        }else{
                            return res.status(403).send({message: "ID de categoría inexistente o ya fue eliminada"});
                        }
                    })
                }else{
                    return res.status(404).send({message: "No se actualizó"});
                }
            })
        }else{
            return res.status(403).send({message: "ID de categoría inexistente o ya fue eliminada"});
        }
    })
}

function getCategories(req,res){
    Category.find({}).populate("products").exec((err,categories)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener los datos"});
        }else if(categories){
            return res.send({message: "Categorías:", categories});
        }else{
            return res.status(403).send({message: "No hay datos"});
        }
    })
}

function getCategoriesId(req,res){
    let categoryId = req.params.id;

    Category.findById(categoryId).populate("products").exec((err,categories)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener los datos"});
        }else if(categories){
            return res.send({message: "Categoría:", categories});
        }else{
            return res.status(403).send({message: "No hay datos"});
        }
    })
}

function searchCategory(req,res){
    var params = req.body;

    if(params.search){
        Category.find({name: params.search},(err,categoryFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(categoryFind){
                if(categoryFind != ""){
                    return res.send({message: "Coinciencias encontradas: ",categoryFind});
                }else{
                    return res.status(404).send({message: "No se encontraron coincidencias"});
                }
            }else{
                return res.status(404).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(params.search == ""){
        Category.find({}).exec((err,categories)=>{
            if(err){
                return res.status(500).send({message: "Error al obtener los datos"});
            }else if(categories){
                return res.send({message: "Categorías:",categories});
            }else{
                return res.status(403).send({message: "No hay datos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el dato de búsqueda (search)"});
    }
}

function getIdCategory(req, res){

}

module.exports = {
    deafultCategory,
    createCategory,
    updateCategory,
    removeCategory,
    getCategories,
    searchCategory,
    getImageCategory,
    uploadImageCategory,
    getCategoriesId
    

}