import { Request, Response } from 'express';

import { Parameter } from './parameter';
import { Method } from './Method';
import { RateLimiter } from './ratelimit';
import { GlobalConfig } from './config';

export interface SandboxResponse {
    status: Number;
    data: string | Object;
}

export type RouteHandler = (req: Request, res: Response) => Promise<Response>;

export class Route {
    parameters: Parameter<any>[] = [];
    postBodyFields: Parameter<any>[] = [];
    rateLimitHandler: RateLimiter | undefined;
    sandBoxResponse: SandboxResponse | undefined;

    handler: RouteHandler;

    method: Method;
    path: string;

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
    setHandler(handler: RouteHandler) {
        this.handler = async (
            req: Request,
            res: Response
        ): Promise<Response> => {
            /*
            In the future, this should be its own middleware, instead of being tied to the handler.
             */

            const value = await (!this.rateLimitHandler ||
                this.rateLimitHandler.handle(req));

            if (value) {
                if (
                    GlobalConfig.requestSandboxable(req) &&
                    req.query.sandbox &&
                    this.sandBoxResponse
                ) {
                    return res
                        .status(this.sandBoxResponse.status as number)
                        [
                            typeof this.sandBoxResponse.data === 'string'
                                ? 'send'
                                : 'json'
                        ](this.sandBoxResponse.data);
                }

                const query = req.query as { [key: string]: string };
                const body = req.body as { [key: string]: string };

                (req as any).queryParams = {};
                (req as any).postBody = {};

                for (const parameter of this.parameters) {
                    const result = parameter.test(
                        req,
                        res,
                        query,
                        (req as any).queryParams
                    );

                    if (result !== true) {
                        return;
                    }
                }

                for (const field of this.postBodyFields) {
                    const result = field.test(
                        req,
                        res,
                        body,
                        (req as any).postBody
                    );

                    if (result !== true) {
                        return;
                    }
                }

                return handler(req, res);
            }

            return res.status(429).json(this.rateLimitHandler.response);
        };

        return this;
    }
}