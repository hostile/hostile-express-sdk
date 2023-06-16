const express = require('express');
const cache = require('./cache/cache');
const RateLimitDescriptor = require('../core/ratelimit/rateLimitDescriptor');

module.exports = class API {

    routes = [];
    middleware = [];
    rateLimitPolicy = new RateLimitDescriptor()
        .setBypass(() => true);

    constructor(version, routePath) {
        this.version = version;
        this.routePath = routePath;
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
     *
     * @param rateLimitDescriptor
     */
    setRateLimitDescriptor(rateLimitDescriptor) {
        this.rateLimitPolicy = rateLimitDescriptor;
    }

    /**
     * Adds all routes that are enabled to a Router instance
     * @returns The router instance
     */
    async getRouter() {
        await this.testRoutes();

        const router = express.Router();

        this.routes.filter(route => route.enabled).forEach(route => {
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

        this.middleware.forEach(middleware => router.use(middleware));

        return router;
    }

    /**
     * Runs all route tests
     */
    testRoutes() {
        this.routes.forEach(route => route.test());
    }

    /**
     * Tests and gets all enabled routes
     * @returns An array of all enabled routes
     */
    async getEnabledRoutes() {
        await this.testRoutes();

        return this.routes.filter(route => route.enabled);
    }
}
