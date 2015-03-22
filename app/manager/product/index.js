/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var Q = require('q');
var Product = require('../../models/product');

/**
 * A manager
 *
 * @constructor
 */
function ProductManager() {

}

ProductManager.prototype.findProducts = function (options) {
    var deferred = Q.defer();

    var query = Product.find(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, products) {
        deferred.resolve(products);
    });

    return deferred.promise;
};

ProductManager.prototype.findProduct = function (criteria) {
    var deferred = Q.defer();

    var query = Product.findOne(criteria);

    query.exec(function (err, product) {
        deferred.resolve(product);
    });

    return deferred.promise;
};

/**
 * Update an Product.
 *
 * @param data
 * @returns {promise|*|Q.promise}
 */
ProductManager.prototype.save = function (data) {
    var deferred = Q.defer();

    var user = new Product(data);
    var upsertData = user.toObject();
    delete upsertData._id;

    Product.update({_id: user.id}, upsertData, {upsert: true}, function (err) {
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
module.exports = exports = new ProductManager;