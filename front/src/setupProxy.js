const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api',
        proxy({
            target: 'http://api:5000', // http://localhost:5000
            secure: false,
            changeOrigin: true,
        })
    )
}