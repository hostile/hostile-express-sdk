const express = require('express');

class API {

    routes = [];

    constructor(version, route, middleware) {
        this.version = version;
        this.route = route;
        this.middleware = middleware;
    }

    // add a route to the api
    addRoute(route) {
        this.routes.push(route);
    }

    // get the routing path
    getPath() {
        return `/v${this.version}/${this.route}`
    }

    // get the express router for this api
    async getRouter() {
        await this.testRoutes();

        const router = express.Router();

        this.routes.forEach(route => {
            if (route.enabled)
                router[route.method](route.path, route.handler);
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
