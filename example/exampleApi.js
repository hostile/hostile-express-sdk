require('dotenv').config();

const { API, RedisCache } = require('../index');

const express = require('express');

/**
 * Initializes the API instance and app instance
 * Define host and port constants
 */
const api = new API(1, '/osint', [])
    .setCache(new RedisCache({
        socket: {
            host: '127.0.0.1',
            port: 6379
        },
        username: '',
        password: ''
    }).setElementLifetime(60 * 60));

const app = express();
app.use(express.json());

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

/*
* Add existing route to our API instance and register router
*/
api.addRoute(require('./cashAppHandler'));
api.addRoute(require('./examplePostTest'));

(async () => {
    api.registerMiddleware(app);
    await api.registerRoutes(app);
})().then(() => {
    /**
     * Listens for connections on the provided hostname and port
     */

    app.listen(port, host, () => {
        console.log(`Server started on http://${host}:${port}!`);
    });
})
