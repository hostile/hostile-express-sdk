import { Middleware, RouteHandler } from '../common';
import { Request, Response } from 'express';

import { validateRequest } from './xsrf.module';

export class XsrfMiddleware extends Middleware {
    private readonly routeHandler: RouteHandler;
    private readonly cookie?: string;
    private readonly header?: string;

    public constructor(
        cookie: string = 'X-XSRF-TOKEN',
        header: string = 'X-XSRF-TOKEN',
        routeHandler: RouteHandler
    ) {
        super();

        this.cookie = cookie;
        this.header = header;
        this.routeHandler = routeHandler;
    }

    public async use(
        req: Request,
        res: Response,
        next: () => void
    ): Promise<void> {
        if (!(await validateRequest(req, res, this.header, this.cookie))) {
            return;
        }

        return next();
    }
}
