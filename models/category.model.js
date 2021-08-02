"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var categorySchema = ({
    name: String,
    image: String,
    products: [{type: Schema.ObjectId, ref:"product"}]
})

module.exports = mongoose.model("category",categorySchema);