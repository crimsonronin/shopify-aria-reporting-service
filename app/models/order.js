/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');
var LineItem = require('./lineItem');

var Schema = mongoose.Schema;

function Order() {
    /**
     * Order Schema
     */

    var OrderSchema = new Schema({
        _id: {type: String},
        email: {type: String, default: ''},
        total: {
            price: {type: Number, default: 0},
            lineItems: {type: Number, default: 0},
            tax: {type: Number, default: 0}
        },
        billingAddress: {
            name: {type: String, default: ''},
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        shippingAddress: {
            name: {type: String, default: ''},
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        lineItems: [LineItem],
        raw: {}
    });

    //indexes
    OrderSchema.index({'email': -1});

    return mongoose.model('Order', OrderSchema);
}

module.exports = exports = new Order;
