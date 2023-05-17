const express = require('express');

const {Middleware, API, Route} = require('../lib');

// api key example
const API_KEY = 'test';

// create middlewares
const auth = new Middleware();
const std = new Middleware();

// create auth middleware and define function
auth.setUse((req, res, next) => {

    if (req.query.key !== API_KEY) {
        return Error('failed to authenticate');
    }

    next();
});

// create standardization middleware and define function
std.setUse((req, res, next) => {

    // example parameter check
    if (super.parameters.length > 0) {
        super.parameters.forEach(parameter => {
            if (!req.query[parameter]) {
                return Error('missing parameter');
            }
        });
    }

    next();
});

// create a new api
const api = new API('/api', 1, [auth, std]);

// create a route that returns all enabled routes
api.addRoute(new Route('get', '/routes', [], (req, res) => {

    let enabled = [];

    api.getEnabledRoutes().forEach(route => {
        enabled.push(route.path);
    });

    res.json({enabled});

}));

// create an express app
const app = express();

// use the api
app.use(api.getPath(), api.getRouter());

// start the server
app.listen(3000, () => {
    console.log('server started');
});
