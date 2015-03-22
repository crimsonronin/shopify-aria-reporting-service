/**
 * Expose
 */

module.exports = {
    db: process.env.MONGO,
    aria: {
        fileNamePrefix: process.env.MONGO,
        ftp: {
            host: process.env.FTP_HOST,
            port: process.env.FTP_PORT || 20,
            username: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD
        }
    }
};
