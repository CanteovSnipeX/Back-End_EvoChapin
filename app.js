"use strict"

var express = require("express");
var bodyParser = require("body-parser");
var userRoutes = require("./routes/user.route");
var categoryRoutes = require("./routes/category.route");
var productRoutes = require("./routes/product.route");
var cartRoutes = require("./routes/cart.route");
var billRoutes = require("./routes/bill.route");
var commentRoutes = require("./routes/comment.route");
var cors = require('cors');


var app = express();


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());



app.use("/v1",userRoutes);
app.use("/v1",categoryRoutes);
app.use("/v1",productRoutes);
app.use("/v1",cartRoutes);
app.use("/v1",billRoutes);
app.use("/v1",commentRoutes);

module.exports = app;