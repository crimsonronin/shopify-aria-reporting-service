/**
 * Module dependencies.
 */

var config = require('./config');
var db = require('./db');
//var manager = require('./manager');

var consumer = require('./consumer');

//init db
db.connect();

console.log('Starting');
//consumer.getProducts().then(function (products) {
//    console.log(products);
//});

//consumer.getProduct(446588104).then(function (product) {
//    console.log(product);
//});


consumer.getOrders();