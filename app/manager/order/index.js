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
function Manager() {
    this.reporter = require('../reporter');
    this.consumer = require('../consumer');
}

Manager.prototype.run = function () {
    var deferred = Q.defer();


    return deferred.promise;
};

Manager.prototype.pullDataFromShopify = function () {
    var deferred = Q.defer();


    return deferred.promise;
};

Manager.prototype.emailReport = function () {
    var deferred = Q.defer();


    return deferred.promise;
};


/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new Manager;