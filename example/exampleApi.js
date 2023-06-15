require('dotenv').config();

const { API } = require('../index');
const express = require('express');

/**
 * Initializes the API instance and app instance
 */
const api = new API(1, '/osint');
const app = express();

const host = process.env.HOST;
const port = process.env.PORT;

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
