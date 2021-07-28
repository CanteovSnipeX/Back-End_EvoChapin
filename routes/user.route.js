"use strict"

var express = require("express");
var userController = require("../controllers/user.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'})

//Usuario
api.post("/login",userController.login);
api.post("/register",userController.register);
api.put("/updateUser/:id",mdAuth.ensureUser,userController.updateUser);
api.put("/removeUser/:id",mdAuth.ensureUser,userController.removeUser);
api.get("/getUsers",[mdAuth.ensureUser, mdAuth.ensureAdmin],userController.getUsers);
api.post("/saveUserByAdmin/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],userController.saveUserByAdmin);

//Imagenes
api.put('/:id/uploadImage', [mdAuth.ensureUser, upload], userController.uploadImage); 
api.get('/getImage/:fileName', [upload], userController.getImage);


module.exports = api;