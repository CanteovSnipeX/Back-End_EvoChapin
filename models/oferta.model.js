"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ofertaSchema = ({
    name:String,
    fechaInicio:String,
    fechaFnalizacion:String,
    products: [{type: Schema.ObjectId, ref:"product"}]
})



module.exports = mongoose.model("oferta",ofertaSchema);