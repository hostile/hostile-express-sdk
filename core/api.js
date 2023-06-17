const express = require('express');
const cache = require('./cache/cache');

module.exports = class API {

    routes = [];
    middleware = [];

    constructor(version, routePath, middleware) {
        this.version = version;
        this.routePath = routePath;
        this.middleware = middleware;
    }

    /**
     * Registers a middleware class to the API
     * @param mwFunction The middleware object
     */
    addMiddleware(mwFunction) {
        this.middleware.push(mwFunction);
    }

    /**
     * Registers a route within the API
     * @param route The route to register
     */
    addRoute(route) {
        this.routes.push(route);
    }

    /**
     * Determines the version-inclusive API route
     * @returns The API route
     */
    get path() {
        return `/v${this.version}${this.routePath}`;
    }

    /**
     * Sets the cache to the provided instance
     * @param cacheInstance The cache to set the instance to
     * @returns The current API instance
     */
    setCache(cacheInstance) {
        cache.cache = cacheInstance;
        return this;
    }

    /**
     * Adds all routes that are enabled to a Router instance
     * @returns The router instance
     */
    async getRouter() {
        const router = express.Router();

        this.routes.forEach(route => {
            switch (route.method.toUpperCase()) {
                case 'GET':
                    router.get(route.path, route.handler);
                    break;
                case 'POST':
                    router.post(route.path, route.handler);
                    break;
                case 'PUT':
                    router.put(route.path, route.handler);
                    break;
                case 'DELETE':
                    router.delete(route.path, route.handler);
                    break
                case 'PATCH':
                    router.patch(route.path, route.handler);
                    break;
                case 'OPTIONS':
                    router.options(route.path, route.handler);
                    break
                case 'HEAD':
                    router.head(route.path, route.handler);
                    break
            }
        });

        return router;
    }

    async registerRoutes(app) {
        app.use(this.path, await this.getRouter());
    }

    /**
     * Registers the API middleware
     * @param app The app instance
     */
    registerMiddleware(app) {
        this.middleware.forEach(middleware => app.use('/', middleware.use));
    }
}
