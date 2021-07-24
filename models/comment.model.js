"use strict"

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = Schema ({
    typecomment:String,
    comment:String
})

module.exports = mongoose.model("comment",commentSchema);