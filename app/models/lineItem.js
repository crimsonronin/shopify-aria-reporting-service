/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');
var Product = require('./product');

var Schema = mongoose.Schema;

function LineItem() {
    /**
     * LineItem Schema
     */

    var LineItemSchema = new Schema({
        _id: {type: String},
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        price: {type: Number, default: 0},
        quantity: {type: Number, default: 0},
        raw: {}
    });

    return mongoose.model('LineItem', LineItemSchema);
}

module.exports = exports = new LineItem;
