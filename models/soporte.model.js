"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var soporteSchema = ({
    problem: String,
    description:String,
})

module.exports = mongoose.model("soporte",soporteSchema);