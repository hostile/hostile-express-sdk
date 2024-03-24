import 'express';

import { Express, Router, IRouter } from 'express';
import { PathLike } from 'fs';

import { Cache, setCache } from '../cache';

import { Route } from '../index';
import { Middleware } from '../index';

import { findRoutes } from '../../util';

export class RouteGroup {
    private routes: Route[] = [];
    private middleware: Middleware[] = [];

    private readonly path: string;

    constructor(path: string, middleware: Middleware[]) {
        this.path = path;
        this.middleware = middleware;
    }

    /**
     * Registers a middleware class to the RouteGroup
     * @param middleware The middleware object
     * @return The current RouteGroup instance
     */
    public addMiddleware(middleware: Middleware): RouteGroup {
        this.middleware.push(middleware);
        return this;
    }

    /**
     * Registers a route within the RouteGroup
     * @param route The route to register
     * @return The current RouteGroup instance
     */
    public addRoute(route: Route): RouteGroup {
        this.routes.push(route);
        return this;
    }

    /**
     * Sets the cache to the provided instance
     * @param cacheInstance The cache to set the instance to
     * @returns The current RouteGroup instance
     */
    public setCache<V>(cacheInstance: Cache<V>): RouteGroup {
        setCache(cacheInstance);
        return this;
    }

    /**
     * Adds all routes that are enabled to a Router instance
     * @returns The router instance
     */
    public async getRouter(): Promise<IRouter> {
        const router = Router();

        this.routes.forEach((route) => {
            (router as any)[route.method.toLowerCase()](
                route.path,
                route.handler
            );
        });

        return router;
    }

    public async registerRoutes(app: Express): Promise<void> {
        app.use(this.path, await this.getRouter());
    }

    public registerRoutesFromDirectory(directory: PathLike): RouteGroup {
        findRoutes(directory)
            .map((location) => require(location).default)
            .filter((exported) => exported instanceof Route)
            .forEach((route) => this.addRoute(route));

        return this;
    }

    /**
     * Registers the RouteGroup middleware
     * @param app The app instance
     */
    public registerMiddleware(app: Express): RouteGroup {
        this.middleware.forEach((middleware) =>
            app.use(this.path, middleware.use)
        );

        return this;
    }
}
