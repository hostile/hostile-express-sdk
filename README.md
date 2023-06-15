# API Core

The core Node module (powered by Express) used in Hostile's v2 API, which simplifies 
management of routing, middleware, required parameters in requests,
required elements in POST data, and more.

### Authors & Licensing

This project was created by the Hostile development team. You're free to use
any code from this project in your own projects, commercial or personal, under
the condition that this software is provided on an as-is basis, without any form
of warranty or guarantee.

### Contributing

In order to contribute to this project, feel free to fork it and make a pull
request with your changes. Please follow the provided pull request format.

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
const path = api.getPath();

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

// create a new middleware
const middleware = new Middleware();

// define its use function
middleware.use((req, res, next) => {
    console.log('Hello World!');
    next();
});

```

### Example

```javascript
const express = require('express');
const { Middleware, API, Route } = require('api-core');

const app = express();
const std = new Middleware();

std.use((req, res, next) => {
    console.log('Hello World!');
    next();
});

const api = new API(1, 'example', [std]);

const route = new Route('get', '/example', [], (req, res) => {
    res.send('Hello World!');
});

api.addRoute(route);

app.use(api.getPath(), api.getRouter());
```

