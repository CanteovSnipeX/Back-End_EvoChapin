"use strict"

var User = require("../models/user.model");
var Cart = require("../models/cart.model");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
var fs = require('fs');
var path = require('path');

function createCart(user){
    var cart = new Cart();

    cart.compra = false;
    cart.owner = user._id;
    cart.save((err,cartSaved)=>{
        if(err){
            console.log(err);
        }else if(cartSaved){
            console.log("Carro de compras creado exitosamente",cartSaved);
        }else{
            console.log("No se creó");
        }
    })
}

/*function admin(){
    User.findOne({username: "ADMIN"},(err,adminFind)=>{
        if(err){
            console.log("Error al verificar ADMIN");
        }else if(adminFind){
            console.log("El usuario ADMIN ya existe");
        }else{
            var user = new User();
            bcrypt.hash("123456",null,null,(err,passwordHashed)=>{
                if(err){
                    console.log("Error al encriptar contraseña");
                }else if(passwordHashed){
                    user.username = "ADMIN";
                    user.password = passwordHashed;
                    user.role = "ROLE_ADMIN";
                    user.save((err,userSaved)=>{
                        if(err){
                            console.log("Error al crear el ADMIN");
                        }else if(userSaved){
                            createCart(userSaved);
                            console.log("Usuario ADMIN creado exitosamente");
                        }else{
                            console.log("No se creó el usuario ADMIN");
                        }
                    })
                }else{
                    console.log("No se encriptó la contraseña");
                }
            })
        }
    })
}*/

function login(req, res){
    var params = req.body;
    
    if(params.username && params.password){
        User.findOne({username: params.username.toLowerCase()}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la verificación de la contraseña'});
                    }else if(checkPassword){
                        if(params.gettoken){
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            return res.send({ message: 'Usuario logeado'});
                        }
                    }else{
                        return res.status(401).send({message: 'Contrasea incorrecta'});
                    }
                })
            }else{
                return res.send({message: 'Ususario no encontrado'});
            }
        }).populate('bills');
    }else{
        return res.status(401).send({message: 'Por favor ingresa los datos obligatorios'});
    }
}


function register(req,res){
    var params = req.body;
    var user = new User();

    if(params.name && params.username && params.password && params.email){
        User.findOne({username: params.username},(err,userFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(userFind){
                return res.send({message: "Nombre de usuario ya utilizado"});
            }else{
                bcrypt.hash(params.password,null,null,(err,passwordHashed)=>{
                    if(err){
                        return res.status(500).send({message: "Error al encriptar la contraseña"});
                    }else if(passwordHashed){
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.password = passwordHashed;
                        user.email = params.email.toLowerCase();
                            user.role = "ROLE_CLIENTE";
                        user.save((err,userSaved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al registrarse"});
                            }else if(userSaved){
                                createCart(userSaved);
                                return res.send({message: "Usuario creado exitosamente",userSaved});
                            }else{
                                return res.status(404).send({message: "No se registró"});
                            }
                        })
                    }else{
                        return res.status(404).send({message: "Contraseña no encriptada"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos mínimos (Nombre, usuario, contraseña y correo)"});
    }
}

function uploadImage(req, res){
    var userId = req.params.id;
    var update = req.body;
    var fileName;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos'});
    }else{
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
                    User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            res.send({user: userUpdated, userImage:userUpdated.image});
                        }else{
                            res.status(400).send({message: 'No se ha podido actualizar'});
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
}

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function saveUserByAdmin(req, res) {
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(userId != req.user.sub){
        res.status(401).send({message: 'No tienes permiso para crear usuarios en esta ruta'})
    }else{
        if(params.name){
            User.findOne({name: params.name}, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general en el servidor'});
                }else if(userFind){
                    return res.send({message: 'Nombre de usuario ya en uso'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general en la encriptación'});
                        }else if(passwordHash){
                            user.password = passwordHash;
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.role = params.role;
                            user.username = params.username.toLowerCase();
                            user.email = params.email.toLowerCase();
    
                            user.save((err, userSavedAdmin)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar'});
                                }else if(userSavedAdmin){
                                    return res.send({message: 'Usuario guardado', userSavedAdmin});
                                }else{
                                    return res.status(500).send({message: 'No se guardó el usuario'});
                                }
                            })
                        }else{
                            return res.status(401).send({message: 'Contraseña no encriptada'});
                        }
                    })
                }
            })
        }else{
            return res.send({message: 'Por favor ingresa los datos obligatorios'});
        }
    }
}

function updateUser(req, res) {
    let userId = req.params.id;
    let update = req.body;

    if(update.password){
        return res.status(500).send({message: "No se puede actualizar la contrasena"});
    }else{
        if(update.username){
            User.findOne({username: update.username.toLowerCase()},(err ,userFind)=>{
                    if(err){
                        return res.status(500).send({message: "Error General"});
                    }else if(userFind){
                        return res.status(500).send({message: "Nombre de usuario ya utilizado"});
                    }else{
                        User.findByIdAndUpdate(userId, update,{new: true},(err,userUpdate)=>{
                            if(err){
                                return res.status(500).send({message: "Error General al actualizar"});
                            }else if(userUpdate){
                                return res.send({message: "Usuario Actualizado", userUpdate });
                            }else{
                                return res.status(404).send({message: "No se pudo actualizar"});
                            }
                        })
                     }
                })
            }
        }
}

function removeCart(user){
    Cart.findOneAndRemove({owner: user._id},(err,cartRemoved)=>{
        if(err){
            console.log("Error al eliminar carrito");
        }else if(cartRemoved){
            console.log("Carrito eliminado exitosamente");
        }else{
            console.log("No se eliminó el carrito");
        }
    })
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        User.findOne({_id: userId}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al eliminar'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al verificar contraseña'});
                    }else if(checkPassword){
                        User.findByIdAndRemove(userId, (err, userRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar'});
                            }else if(userRemoved){
                                return res.send({message: 'Usuario eliminado', userRemoved});
                            }else{
                                return res.status(403).send({message: 'Usuario no eliminado'});
                            }
                        })
                    }else{
                        return res.status(401).send({message: 'Contraseña incorrecta, no puedes eliminar tu cuenta sin tu contraseña'});
                    }
                })
            }else{
                return res.status(403).send({message: 'Usuario no eliminado'});
            } 
        })
    }
}




function getUsers(req, res){
    User.find({}).populate('torneo').exec((err, users) => {
            if(err){
                    return res.status(500).send({message: 'Error general en el servidor'})
            }else if(users){
                    return res.send({message: 'Usuarios: ', users})
            }else{
                    return res.status(404).send({message: 'No hay registros'})
            }
        })    

}

module.exports = {
    //admin,
    login,
    register,
    updateUser,
    removeUser,
    saveUserByAdmin,
    uploadImage,
    getImage,
    getUsers
}