# Hostile Core SDK

The core Node SDK (powered by Express) used in Hostile's v2 API, 
which simplifies management of routing, middleware, smart
application-level rate limiting, required parameters in requests,
caching, and more.

### Authors & Licensing

This project was created by the Hostile team. Feel free to use
any code from this project in your own projects, commercial or
personal, under the condition that this software is provided on
an as-is basis, without any form of warranty or guarantee.

### Contributing

In order to contribute to this project, feel free to fork it and
make a pull request with your changes. Please follow the provided
pull request format.

### Installation

Installing the Hostile API core into your preexisting Node.js
project is simple. Ensure you have Express installed, then
execute `npm install hostile-express-sdk`.

### Implementation - API

```javascript
/**
 * Creates a new API instance, with the version set to one,
 * the default route set to "example", and no middleware.
 * 
 * You should already have your app instance set up.
 * This does not go over initializing your app instance,
 * or listening on a port, since that's handled entirely
 * by Express.
 */

import { API, LocalCache, GlobalConfig } from 'hostile-express-sdk';

GlobalConfig.cache = new LocalCache().setElementLifetime(60 * 60 * 1000);

const index = new API(1, '/test', []);

/**
 * Returns the path of the API (for example, /v1/example)
 */
const path = index.path;

/**
 * Returns the express router of the API, which will run
 * the integrated tests and return a router instance containg
 * all of the routes that passed their checks
 */
const router = index.getRouter();

/**
 * Register all routes and middleware, then log
 * all registered routes
 */
async () => {
    await index.registerRoutes(app);
    index.registerMiddleware(app);

    index.routes.forEach((route) => {
        console.log(`${route.method} - ${route.path}`);
    });
};
```

### Implementation - Routes

```javascript
/**
 * Creates a new GET route on /example, that responds to requests
 * with "Hello World!"
 */
const route = new Route(Method.GET, '/example', []).setHandler((req, res) => {
    return res.send('Hello World!');
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
};
```

### Implementation - Parameter

```javascript
/*
 * Create a route parameter object
 */
const param = new Parameter()
    .setName('username')
    .setRequired(true)
    .setValidationFunction((username) => username !== null);

/*
 * Add that object to array of route params
 */
route.setParameters([param]);
```

### Complete Example

```javascript
import {
    Middleware,
    API,
    Route,
    MemoryCache,
    RateLimiter,
} from 'hostile-express-sdk';

import express from 'express';

const std = new Middleware();
const app = express();

const host = process.env.HOST || '127.0.0.1';
const port = 3000;

std.setUse((req, res, next) => {
    console.log('Hello World!');
    next();
});

const index = new API(1, 'example', [std]).setCache(
    new LocalCache()
        .setElementLifetime(1000 * 60 * 60)
        .setPurgeTimePeriod(5000)
);

index.addRoute(
    new Route('GET', '/example', []).setHandler((req, res) => {
        res.send('Hello World!');
    }).setRateLimitHandler(
        new RateLimiter().setPeriod('5/minute').setResponse({
            status: 'failed',
            message: 'You are being rate limited!',
        })
    )
);

/*
Register all routes and middleware
 */
const init = async () => {
    index.registerMiddleware(app);
    await index.registerRoutes(app);
};

/*
Call the init function, then listen for connections
on the port and host defined by the environment variables.
 */
init().then(() => {
    app.listen(port, host, () => {
        console.log(`Server started on http://${host}:${port}!`);
    });
});
```
