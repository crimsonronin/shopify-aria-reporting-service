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

}

Manager.prototype.run = function () {
    var deferred = Q.defer();


    return deferred.promise;
};

/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new Manager;