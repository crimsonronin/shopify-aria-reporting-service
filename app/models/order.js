/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function Product() {
    /**
     * Product Schema
     */

    var ProductSchema = new Schema({
        _id: {type: String},
        name: {type: String, default: ''},
        aria: {
            artistName: {type: String, default: ''},
            releaseName: {type: String, default: ''},
            catalogueNumber: {type: String, default: ''},
            barcode: {type: String, default: ''},
            releaseDate: {type: Date}
        }
    });

    //indexes
    ProductSchema.index({'aria.releaseDate': -1});

    return mongoose.model('Product', ProductSchema);
}

module.exports = exports = new Product;
