# API Core

The core Node module (powered by Express) used in Hostile's v2 API, which simplifies
management of routing, middleware, smart rate limiting, required parameters in requests,
required elements in POST data, and more.

### Authors & Licensing

This project was created by the Hostile development team. You're free to use
any code from this project in your own projects, commercial or personal, under
the condition that this software is provided on an as-is basis, without any form
of warranty or guarantee.

### Contributing

In order to contribute to this project, feel free to fork it and make a pull
request with your changes. Please follow the provided pull request format.

### Installation

Installing the Hostile API core into your preexisting Node.js project is simple. Ensure
you have Express installed, then execute `npm install hostile-core-package`.

### Implementation - API

```javascript
/**
 * Creates a new API instance, with the version set to one,
 * the default route set to "example", and no middleware
 */
const api = new require('api-core').API(1, 'example', []);

/**
 * Returns the path of the API (for example, /v1/example)
 */
const path = api.path;

/**
 * Returns the express router of the API, which will run
 * the integrated tests and return a router instance containg
 * all of the routes that passed their checks
 */
const router = api.getRouter();

/**
 * Returns all enabled routes, which also runs all
 * integrated tests
 */
const enabled = api.getEnabledRoutes();

/**
 * Demonstrates logging all enabled routes
 */
enabled.forEach(route => {
    console.log(route.getMethod() + ' ' + route.getPath());
});

/**
 * Pass the router instance to Express
 */
app.use(path, router);
```

### Implementation - Routes

```javascript
/**
 * Creates a new GET route on /example, that responds to requests
 * with "Hello World!"
 */
const route = new Route('get', '/example', [], (req, res) => {
        res.send('Hello World!');
    });

/**
 * Sets the route's test function, which is used to simply
 * test for functionality
 */
route.setTest(() => {
    return 1 + 1 == 2;
});
```

### Implementation - Middleware

```javascript
/**
 * Create a new middleware object
 */
const middleware = new Middleware();

/**
 * Define its handler
 */
middleware.setUse((req, res, next) => {
    console.log('Hello World!');
    next();
});
```

### Implementation - Parameter

```javascript

/*
* Create a route parameter object
*/
const param = new Parameter()
    .setName('username')
    .setRequired(true)
    .setValidationFunction((username) => standardizeUsername(username));

/*
* Add that object to array of route params
*/
route.setParameters([param]);
``` 

### Complete Example

```javascript
const { Middleware, API, Route, MemoryCache, RateLimitDescriptor } = require('api-core');
const express = require('express');

const std = new Middleware();
const app = express();

std.setUse((req, res, next) => {
    console.log('Hello World!');
    next();
});

const api = new API(1, 'example', [std])
    .setCache(new MemoryCache()
        .setElementLifetime(1000 * 60 * 60)
        .setPurgeTimePeriod(5000)
    );

api.addRoute(new Route('GET', '/example', [], (req, res) => {
    res.send('Hello World!');
}).setRateLimitHandler(new RateLimitDescriptor()
    .setPeriod('5/minute')
));

const init = async () => {
    // callback
    api.getRouter().then((router) => {
        app.use(api.path, router);
    })

    // await
    const apiRouter = await api.getRouter();
    app.use(api.path, apiRouter);
}

init().then(() => {
    console.log('Initialized!');
})
```
