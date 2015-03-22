/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var Q = require('q');
var Order = require('../../models/order');

/**
 * A manager
 *
 * @constructor
 */
function OrderManager() {

}

OrderManager.prototype.findOrders = function (options) {
    var deferred = Q.defer();

    var query = Order.find(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, orders) {
        deferred.resolve(orders);
    });

    return deferred.promise;
};

OrderManager.prototype.findOrder = function (options) {
    var deferred = Q.defer();

    var query = Order.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, order) {
        deferred.resolve(order);
    });

    return deferred.promise;
};

/**
 * Update an Order.
 *
 * @param data
 * @returns {promise|*|Q.promise}
 */
OrderManager.prototype.save = function (data) {
    var deferred = Q.defer();

    var user = new Order(data);
    var upsertData = user.toObject();
    delete upsertData._id;

    Order.update({_id: user.id}, upsertData, {upsert: true}, function (err) {
        if (!err) {
            deferred.resolve();
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise;
};

/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new OrderManager;