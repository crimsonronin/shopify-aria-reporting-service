/**
 * @author Josh Stuart <joshstuartx@gmail.com>.
 */

var Q = require('q');
var config = require('../config');
var Order = require('../models/order');
var Product = require('../models/product');
var LineItem = require('../models/lineItem');
var OrderManager = require('../manager/order');
var ProductManager = require('../manager/product');

/**
 * A manager
 *
 * @constructor
 */
function Consumer() {
    this.shopify = require('./shopify');
}

Consumer.prototype.getOrders = function () {
    var deferred = Q.defer();

    this.shopify.getOrders().then((function (ordersData) {
        this.parseOrders(ordersData).then(function (orders) {
            var deferreds = [];
            for (var i in orders) {
                var orderDeferred = Q.defer();
                deferreds.push(orderDeferred.promise);

                OrderManager.save(orders[i]).then(function () {
                    orderDeferred.resolve();
                });
            }

            Q.all(deferreds).then(function () {
                deferred.resolve();
            });
        });
    }).bind(this));

    return deferred.promise;
};

Consumer.prototype.getOrder = function (orderId) {
    return this.shopify.getOrder(orderId);
};

Consumer.prototype.getProducts = function () {
    return this.shopify.getProducts();
};

Consumer.prototype.getProduct = function (productId) {
    var deferred = Q.defer();

    this.shopify.getProduct(productId).then((function (productData) {
        this.parseProduct(productData).then(function (product) {
            ProductManager.save(product).then(function () {
                deferred.resolve(product);
            });
        });
    }).bind(this));

    return deferred.promise;
};

Consumer.prototype.getMetadataForProduct = function (productId) {
    var deferred = Q.defer();

    this.shopify.getMetadataForProduct(productId).then((function (metadata) {
        this.parseMetafields(metadata).then(function (metadata) {
            deferred.resolve(metadata);
        });
    }).bind(this));

    return deferred.promise;
};

/**
 * Parses a list of orders.
 *
 * @param orders
 * @returns {Array}
 */
Consumer.prototype.parseOrders = function (ordersData) {
    var deferred = Q.defer();
    var deferreds = [];
    var orders = [];

    for (var i in ordersData) {
        var orderDeferred = Q.defer();
        deferreds.push(orderDeferred.promise);

        this.parseOrder(ordersData[i]).then(function (order) {
            console.log('push')
            orders.push(order);
            orderDeferred.resolve();
        });
    }

    Q.all(deferreds).then(function () {
        console.log('orders');
        deferred.resolve(orders);
    });

    return deferred.promise;
};

/**
 * Parses an order object into an Order model.
 *
 * @param order
 * @returns {Order}
 */
Consumer.prototype.parseOrder = function (orderData) {
    var deferred = Q.defer();

    var order = new Order({
        _id: orderData.id,
        email: orderData.email,
        total: {
            price: orderData.total_price,
            lineItems: orderData.total_line_items_price,
            tax: orderData.total_tax
        },
        billingAddress: {
            name: orderData.billing_address.name,
            line1: orderData.billing_address.address1,
            line2: orderData.billing_address.address2,
            suburb: orderData.billing_address.city,
            postcode: orderData.billing_address.province_code,
            country: orderData.billing_address.country_code
        },
        shippingAddress: {
            name: orderData.shipping_address.name,
            line1: orderData.shipping_address.address1,
            line2: orderData.shipping_address.address2,
            suburb: orderData.shipping_address.city,
            postcode: orderData.shipping_address.province_code,
            country: orderData.shipping_address.country_code
        },
        raw: orderData
    });

    //parse line items
    this.parseLineItems(orderData.line_items).then(function (lineItems) {
        order.lineItems = lineItems;
        deferred.resolve(order);
    });

    return deferred.promise;
};

/**
 * Parses a list of line items
 *
 * @param orders
 * @returns {Array}
 */
Consumer.prototype.parseLineItems = function (lineItemsData) {
    var deferred = Q.defer();
    var deferreds = [];
    var lineItems = [];

    for (var i in lineItemsData) {
        var itemDeferred = Q.defer();
        deferreds.push(itemDeferred.promise);

        this.parseLineItem(lineItemsData[i]).then(function (lineItem) {
            lineItems.push(lineItem);
            itemDeferred.resolve();
        });
    }

    Q.all(deferreds).then(function () {
        deferred.resolve(lineItems);
    });

    return deferred.promise;
};

/**
 * Parses a line item
 *
 * @param orders
 * @returns {Array}
 */
Consumer.prototype.parseLineItem = function (lineItemData) {
    var deferred = Q.defer();
    var lineItem = new LineItem({
        _id: lineItemData.id,
        price: lineItemData.price,
        quantity: lineItemData.quantity,
        raw: lineItemData
    });

    var productId = lineItemData.product_id;
    //check for the existing product or create one
    ProductManager.findProduct({_id: productId}).then((function (product) {
        if (!!product) {
            lineItem.product = product;
            deferred.resolve(lineItem);
        } else {
            // we dont have a product so parse and save
            this.getProduct(productId).then(function (product) {
                lineItem.product = product;
                deferred.resolve(lineItem);
            });
        }
    }).bind(this));
    return deferred.promise;
};

/**
 * Parses a list of products.
 *
 * @param products
 * @returns {Array}
 */
Consumer.prototype.parseProducts = function (productsData) {
    var deferred = Q.defer();
    var deferreds = [];
    var products = [];

    for (var i in productsData) {
        var productDeferred = Q.defer();
        deferreds.push(productDeferred.promise);

        this.parseProduct(productsData[i]).then(function (product) {
            products.push(product);
            productDeferred.resolve();
        });
    }

    Q.all(deferreds).then(function () {
        deferred.resolve(products);
    });

    return deferred.promise;
};

/**
 * Parses a product object into a Product model.
 *
 * @param productData
 * @returns {promise|*|Q.promise}
 */
Consumer.prototype.parseProduct = function (productData) {
    var deferred = Q.defer();

    var product = new Product({
        _id: productData.id,
        name: productData.title,
        raw: productData
    });

    this.getMetadataForProduct(product._id).then(function (metadata) {
        //if we have metafields
        if (!!metadata.aria) {
            var aria = metadata.aria;

            product.aria = {
                artistName: aria.artist_name,
                releaseName: aria.release_name,
                catalogueNumber: aria.catalogue_number,
                barcode: aria.barcode,
                releaseDate: (!!aria.release_date) ? (new Date(aria.release_date)) : ''
            };
        }
        deferred.resolve(product);
    });

    return deferred.promise;
};

/**
 * Parses a metadata object into something more usable.
 *
 * @param metafields
 * @returns {promise|*|Q.promise}
 */
Consumer.prototype.parseMetafields = function (metafields) {
    var deferred = Q.defer();
    var metadata = {};

    for (var i in metafields) {
        var field = metafields[i];

        var namespace = slugify(field.namespace);
        var key = slugify(field.key);

        if (!metadata[namespace]) {
            metadata[namespace] = {}
        }

        metadata[namespace][key] = field.value;
    }

    deferred.resolve(metadata);
    return deferred.promise;
};

function slugify(str) {
    return str.toLowerCase().replace(' ', '_');
}

/**
 * Expose
 * @type {Manager}
 */
module.exports = exports = new Consumer;