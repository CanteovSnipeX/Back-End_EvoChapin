"use strict"

var express = require("express");
var ofertaController = require("../controllers/oferta.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");



api.post("/setOferta",[mdAuth.ensureUser,mdAuth.ensureAdmin],ofertaController.setOferta);
api.put("/removeOferta/:id",[mdAuth.ensureUser, mdAuth.ensureAdmin],ofertaController.removeOferta);

module.exports = api