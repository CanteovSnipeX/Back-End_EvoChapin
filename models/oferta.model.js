"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ofertaSchema = ({
    name:String,
    fechaInicio:String,
    fechaFnalizacion:String,
    products:[String]
})



module.exports = mongoose.model("oferta",ofertaSchema);