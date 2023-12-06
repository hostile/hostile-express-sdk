import 'express';

import { Express, Router, IRouter } from 'express';
import { PathLike } from 'fs';

import { Cache, setCache } from './cache';

import { Route } from './index';
import { Middleware } from './index';

import { findRoutes } from '../util';

export class API {
    private routes: Route[] = [];
    private middleware: Middleware[] = [];

    private readonly version: Number;
    private readonly routePath: string;

    constructor(version: Number, routePath: string, middleware: Middleware[]) {
        this.version = version;
        this.routePath = routePath;
        this.middleware = middleware;
    }

    /**
     * Registers a middleware class to the API
     * @param middleware The middleware object
     * @return The current API instance
     */
    public addMiddleware(middleware: Middleware): API {
        this.middleware.push(middleware);
        return this;
    }

    /**
     * Registers a route within the API
     * @param route The route to register
     * @return The current API instance
     */
    public addRoute(route: Route): API {
        this.routes.push(route);
        return this;
    }

    /**
     * Determines the version-inclusive API route
     * @returns The API route
     */
    get path() {
        return `/v${this.version}${
            this.routePath.startsWith('/')
                ? this.routePath
                : '/' + this.routePath
        }`;
    }

    /**
     * Sets the cache to the provided instance
     * @param cacheInstance The cache to set the instance to
     * @returns The current API instance
     */
    public setCache<V>(cacheInstance: Cache<V>): API {
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

    public registerRoutesFromDirectory(directory: PathLike): API {
        findRoutes(directory)
            .map((location) => require(location).default)
            .filter((exported) => exported instanceof Route)
            .forEach((route) => this.addRoute(route));

        return this;
    }

    /**
     * Registers the API middleware
     * @param app The app instance
     */
    public registerMiddleware(app: Express): API {
        this.middleware.forEach((middleware) =>
            app.use(this.path, middleware.use)
        );

        return this;
    }
}
