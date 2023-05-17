# api-core
api core module written in node in preparation for v2 

# Classes

### API

```javascript

// create a new api with version 1, name example, and no middleware
const api = new require('api-core').API(1, 'example', []);

const path = api.getPath(); // /v1/example

const router = api.getRouter(); // express router

app.use(api.getPath(), api.getRouter()); // pass the router to express

```

### Route

```javascript

// create a new GET route, no params
const route = new Route('get', '/example', [], (req, res) => {
    res.send('Hello World!');
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

