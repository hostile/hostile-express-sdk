import { Request, Response } from 'express';

import { Parameter } from '../../parameter';
import { Method } from '../../types';
import { RateLimiter } from '../../ratelimit';
import { GlobalConfig } from '../../config';

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
                if (GlobalConfig.canRequestUseSandbox(req) && req.query.sandbox && this.sandBoxResponse) {
                    return res
                        .status(this.sandBoxResponse.status as number)
                        [typeof this.sandBoxResponse.data === 'string' ? 'send' : 'json'](
                            this.sandBoxResponse.data
                        );
                }

                const query = req.query as NodeJS.Dict<any>;
                const body = req.body as NodeJS.Dict<any>;

                const neededFields = [
                    ...this.parameters.map((parameter) => parameter.test(req, res, query)),
                    ...this.postBodyFields.map((field) => field.test(req, res, body)),
                ].filter((field) => !field);

                if (neededFields.length > 0) {
                    return;
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
