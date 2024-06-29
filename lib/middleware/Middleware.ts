import { Request, Response } from 'express';

export class Middleware {
    constructor() {}

    /**
     * Abstract usage method
     */
    public async use(_req: Request, _res: Response, _next: () => void): Promise<void> {
        throw new Error('Middleware function not overridden!');
    }

    /**
     * Sets the handler
     * @param fn The handler function
     * @return The current middleware instance
     */
    public setUse(
        fn: (req: Request, res: Response, next: () => void) => Promise<void>
    ): Middleware {
        this.use = fn;
        return this;
    }
}
