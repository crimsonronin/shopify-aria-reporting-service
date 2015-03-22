/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var Q = require('q');
var Shopnode = require('shopnode');
var config = require('../../config').shopify;

/**
 * A manager
 *
 * @constructor
 */
function Shopify() {

}

/**
 * Get's the shopify api
 *
 * @returns {Shopnode|*}
 */
Shopify.prototype.getApi = function () {
    if (!this.api) {
        this.setApi();
    }
    return this.api;
};

/**
 * Instantiates a shopify api.
 *
 * @param options
 */
Shopify.prototype.setApi = function (options) {
    if (!options) {
        options = {
            storeHost: config.shop + '.myshopify.com',
            apiKey: config.api.key,
            password: config.api.password,
            useBasicAuth: true
        };
    }

    this.api = new Shopnode(options);
};

/**
 * Authorizes our API.
 *
 * @param res
 */
Shopify.prototype.authorize = function (res) {
    var authUrl = this.getApi().buildAuthURL();
    res.redirect(authUrl);
};

/**
 * Gets all orders from shopify and returns an array of Order models.
 *
 * @param options
 * @returns {promise|*|Q.promise}
 */
Shopify.prototype.getOrders = function (options) {
    var deferred = Q.defer();

    this.getApi().orders.getAll(function (err, req, res, obj) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(parseBody(obj.body).orders);
        }
    });

    return deferred.promise;
};

/**
 * Gets an order from shopify and returns an Order model.
 *
 * @param orderId
 * @returns {promise|*|Q.promise}
 */
Shopify.prototype.getOrder = function (orderId) {
    var deferred = Q.defer();

    this.getApi().orders.get({id: orderId}, {}, function (err, req, res, obj) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(parseBody(obj.body).order);
        }
    });

    return deferred.promise;
};

/**
 * Gets all products from shopify and returns an array of Product models.
 *
 * @returns {promise|*|Q.promise}
 */
Shopify.prototype.getProducts = function () {
    var deferred = Q.defer();

    this.getApi().products.getAll(function (err, req, res, obj) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(parseBody(obj.body).products);
        }
    });

    return deferred.promise;
};

/**
 * Gets a product from shopify and returns a Product model.
 *
 * @param productId
 * @returns {promise|*|Q.promise}
 */
Shopify.prototype.getProduct = function (productId) {
    var deferred = Q.defer();

    this.getApi().products.get({id: productId}, {}, function (err, req, res, obj) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(parseBody(obj.body).product);
        }
    });

    return deferred.promise;
};

/**
 * Gets metadata for a product.
 *
 * @param productId
 * @returns {promise|*|Q.promise}
 */
Shopify.prototype.getMetadataForProduct = function (productId) {
    var deferred = Q.defer();

    this.getApi().metafields.getForProduct(productId, function (err, req, res, obj) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(parseBody(obj.body).metafields);
        }
    });

    return deferred.promise;
};

function parseBody(data) {
    if (typeof(data) == 'string') {
        return JSON.parse(data);
    }
    return data;
}

/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new Shopify;