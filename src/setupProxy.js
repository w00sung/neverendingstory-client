const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://15.164.48.192:5000',
            changeOrigin: true,
        })
    );
};