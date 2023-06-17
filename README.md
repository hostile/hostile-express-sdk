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
 * Register all routes and middleware, then log
 * all registered routes
 */
(async () => {
    await api.registerRoutes(app);
    api.registerMiddleware(app);

    api.routes.forEach(route => {
        console.log(`${route.method} - ${route.path}`);
    })
});
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

/**
 * Alternatively, you can do the following
 */
module.exports = class ExampleMiddleware extends Middleware {
    
    async use(req, res, next) {
        console.log(`Path: ${req.path}`);
        
        /*
        Express requires you to call the next() function 
        in middleware to let it know that the middleware 
        ran successfully and it should continue its handling 
        of the request.
         */
        next();
    }
}
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

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

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
    .setResponse({
        status: 'failed',
        message: 'You are being rate limited!'
    })
));

/*
Register all routes and middleware
 */
const init = async () => {
    await api.registerRoutes(app);
    api.registerMiddleware(app);
}

/*
Call the init function, then listen for connections
on the port and host defined by the environment variables.
 */
init().then(() => {
    app.listen(port, host, () => {
        console.log(`Server started on http://${host}:${port}!`);
    });
})
```
