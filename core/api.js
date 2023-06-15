const express = require('express');

class API {

    routes = [];

    middleware = [];

    constructor(version, routePath) {
        this.version = version;
        this.routePath = routePath;
    }

    addMiddleware(mwFunction) {
        this.middleware.push(mwFunction)
    }

    // add a route to the api
    addRoute(route) {
        this.routes.push(route);
    }

    // get the routing path
    getPath() {
        return `/v${this.version}/${this.routePath}`
    }

    // get the express router for this api
    async getRouter() {
        // await this.testRoutes();

        const router = express.Router();

        this.routes.forEach(route => {
            if (route.enabled) {
                switch (route.method) {
                    case 'GET':
                        router.get(route.path, route.handler);
                        break;
                    case 'POST':
                        router.post(route.path, route.handler);
                        break;
                }
            }
        });

        this.middleware.forEach(mw => { router.use(mw()) })

        return router;
    }

    // run route tests
    testRoutes() {
        this.routes.forEach(route => { route.test(); });
    }

    // get a list of enable route classes
    async getEnabledRoutes() {
        await this.testRoutes()

        let routes = [];

        this.routes.forEach(route => {
            if (route.enabled)
                routes.push(route);
        })

        return routes;
    }

}

module.exports = API;
