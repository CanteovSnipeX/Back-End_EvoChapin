"use strict"

var express = require("express");
var categoryController = require("../controllers/category.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/category'})


api.post("/createCategory",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.createCategory);
api.put("/updateCategory/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.updateCategory);
api.put("/removeCategory/:id",[mdAuth.ensureUser,mdAuth.ensureAdmin],categoryController.removeCategory);
api.get("/getCategories",categoryController.getCategories);
api.get("/searchCategory",mdAuth.ensureUser,categoryController.searchCategory);
api.get("/getCategoriesId/:id",categoryController.getCategoriesId);

//imagen
api.put('/:idC/uploadImageCategory/',[mdAuth.ensureUser, upload],categoryController.uploadImageCategory);
api.get('getImageCategory/:fileName',[upload],categoryController.getImageCategory);

module.exports = api;