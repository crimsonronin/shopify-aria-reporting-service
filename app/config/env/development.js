/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/shopify-aria-reporting',
    aria: {
        reportingOptions: {
            time: '3:00',
            period: 'Daily',
            fileNamePrefix: 'artist-first',
            name: 'Artist First'
        },
        ftp: {
            host: '',
            port: 20,
            username: '',
            password: ''
        }
    },
    shopify: {
        shop: 'artist-first',
        api: {
            key: '700618c7be36be14d5260de885ba9939',
            //secret: 'ffd7bef3a415aef8f92e5d5770b1f426',
            password: 'b66dae656ba4fd85207642e0de0fabf9'
        },
        redirectUrl: 'artist-first.myshopify.com'
    }
};
