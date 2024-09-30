import { Request, Response } from 'express';

import { Parameter } from '../parameter';
import { Method } from '../types';
import { RateLimiter } from '../ratelimit';
import { GlobalConfig } from '../config';
import Permissions from '../types/Permissions';
import PermissionMiddleware from '../permissions/PermissionMiddleware';

export interface SandboxResponse {
    status: number;
    data: string | NodeJS.Dict<any>;
}

export type RouteHandler = (req: Request, res: Response) => Promise<Response>;

export class Route {
    private parameters: Parameter<any>[] = [];
    private postBodyFields: Parameter<any>[] = [];
    private rateLimitHandler?: RateLimiter;
    private sandBoxResponse?: SandboxResponse;

    private handler: RouteHandler;

    public method: Method;
    public path: string;
    public permissions: string[];
    public permissionMiddleware: PermissionMiddleware;

    constructor(method: Method, path: string) {
        this.method = method;
        this.path = path;
    }

    /**
     * Sets the expected parameters
     * @param params The expected parameters
     * @returns The current Route instance
     */
    public setParameters(params: Parameter<any>[]): Route {
        this.parameters = params;
        return this;
    }

    /**
     * Sets the expected POST body fields
     * @param postFields The required post fields
     * @returns The current Route instance
     */
    public setPostBodyFields(postFields: Parameter<any>[]): Route {
        this.postBodyFields = postFields;
        return this;
    }

    /**
     * Sets the permissions required to access the route
     * @param permissions The permissions required to access the route
     * @returns The current Route instance
     */
    public setPermissions(permissions: Permissions): Route {
        this.permissions = permissions;
        this.permissionMiddleware = new PermissionMiddleware(permissions);
        return this;
    }

    /**
     * Sets the rate limit handler
     * @param rateLimitHandler The rate limit handler
     * @returns The current Route instance
     */
    public setRateLimitHandler(rateLimitHandler: RateLimiter): Route {
        this.rateLimitHandler = rateLimitHandler;
        return this;
    }

    public setSandboxData(response: SandboxResponse): Route {
        this.sandBoxResponse = response;
        return this;
    }

    /**
     * Sets the route handling function
     * @param handler The handling function
     * @returns The current Route instance
     */
    public setHandler(handler: RouteHandler) {
        this.handler = async (req: Request, res: Response): Promise<Response> => {
            /*
            In the future, this should be its own middleware, instead of being tied to the handler.
             */

            const value = await (!this.rateLimitHandler || this.rateLimitHandler.handle(req));

            if (value) {
                if (
                    GlobalConfig.canRequestUseSandbox(req) &&
                    req.query.sandbox &&
                    this.sandBoxResponse
                ) {
                    return res
                        .status(this.sandBoxResponse.status as number)
                        [typeof this.sandBoxResponse.data === 'string' ? 'send' : 'json'](
                            this.sandBoxResponse.data
                        );
                }

                const query = req.query as NodeJS.Dict<any>;
                const body = req.body as NodeJS.Dict<any>;

                const neededFields = [...this.parameters, ...this.postBodyFields];

                for (const field of neededFields) {
                    const data = this.parameters.includes(field) ? query : body;

                    if (!field.test(req, res, data) && field.isRequired()) {
                        return;
                    }
                }

                return handler(req, res);
            }

            return res.status(429).json(this.rateLimitHandler.response);
        };

        return this;
    }

    get routeHandler(): RouteHandler {
        return this.handler;
    }
}
