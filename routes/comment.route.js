var express = require("express");
var commentController = require("../controllers/comment.controller");
var api = express.Router();
var mdAuth = require("../middlewares/authenticated");


api.post('/setComment',mdAuth.ensureUser,commentController.setComment);
api.put('/removeComment/:id',[mdAuth.ensureUser,mdAuth.ensureAdmin],commentController.removeComment);
api.get('/getComment',[mdAuth.ensureUser,mdAuth.ensureAdmin],commentController.getComment);

module.exports = api;