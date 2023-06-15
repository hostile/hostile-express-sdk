const { API } = require('../index');
const express = require('express');

/**
 * Initializes the API instance and app instance
 * Define host and port constants
 */
const api = new API(1, '/osint');
const app = express();

const host = 127.0.0.1;
const port = 3000;

/*
* Add existing route to our API instance and register router
*/
api.addRoute(require('./cashAppHandler'));

api.getRouter().then((router) => {
    app.use(api.getPath(), router);
})

/**
 * Listens for connections on the provided hostname and port
 */
app.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}!`);
});
