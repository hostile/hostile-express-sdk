# api-core
api core module written in node in preparation for v2 

# Classes

### API

```javascript

// create a new api with version 1, name example, and no middleware
const api = new require('api-core').API(1, 'example', []);

// get the path of the api (e.g. /v1/example)
const path = api.getPath(); 

// get the express router of the api, this will run unit tests
// and return a rounter will all passed routes
const router = api.getRouter();

// get a list of enabled routes, this will also run unit tests
const enabled = api.getEnabledRoutes();

// log enabled routes
enabled.forEach(route => {
    console.log(route.getMethod() + ' ' + route.getPath());
});

// pass the router to express
app.use(path, router);
```

### Route

```javascript

// create a new GET route, no params
const route = new Route('get', '/example', [], (req, res) => {
    res.send('Hello World!');
});

// set route unit test (returns true by default)
route.setTest(() => {
    
    if (1+1 == 2)
        return true;
    else
        return false;

});
```

### Middleware

```javascript

// create a new middleware
const middleware = new Middleware();

// define its use function
middleware.use((req, res, next) => {
    console.log('Hello World!');
    next();
});

```

# Usage Example

```javascript
const {Middleware, API, Route} = require('api-core');

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

