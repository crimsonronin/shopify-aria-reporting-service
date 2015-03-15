/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var Q = require('q');
var config = require('../config');

/**
 * A manager
 *
 * @constructor
 */
function Consumer() {
    this.reporter = require('../reporter');
}

Consumer.prototype.getOrders = function () {
    var deferred = Q.defer();


    return deferred.promise;
};

Consumer.prototype.getOrder = function (orderId) {
    var deferred = Q.defer();


    return deferred.promise;
};

Consumer.prototype.getProduct = function (productId) {
    var deferred = Q.defer();


    return deferred.promise;
};

/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new Manager;