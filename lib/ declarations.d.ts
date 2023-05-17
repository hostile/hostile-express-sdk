import { Router } from 'express';

declare module 'api-core' {

    export class Middleware {
        constructor();

        use(): void;
        setUse(use: Function): void;
    }

    export class Route {
        enabled: boolean;

        constructor(method: string, path: string, parameters: Array<any>, handler: Function);
        test(): void;
    }

    export class API {
        routes: Array<Route>;

        constructor(version: Number, route: string, middleware: Array<Middleware>);

        addRoute(route: Route): void;
        getPath(): string;
        getRouter(): Promise<Router>;
        testRoutes(): void;
        getEnabledRoutes(): Array<Route>;
    }
}