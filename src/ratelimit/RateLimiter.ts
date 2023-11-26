import { Request } from 'express';
import { cache } from '../common';

import { TimePeriodMeta, Second, Periods } from './TimePeriod';

export class RateLimiter {
    public response: Object = {
        status: 'failed',
        message: 'You are being rate limited! Try slowing down your requests.',
    };

    private quantity: Number = 0;
    private timePeriod: TimePeriodMeta = Second;

    public rateLimitIdentifier: (req: Request) => string = (req: Request) => {
        return req.header('x-forwarded-for') || req.socket.remoteAddress;
    };

    public bypassFunction: (req: Request) => boolean = () => {
        return false;
    };

    /**
     * Sets the time period of the rate limiting descriptor
     * @param period The period to be used to determine if a request is valid
     * @returns The RateLimiter instance
     */
    public setPeriod(period: string): RateLimiter {
        const parts = period.split('/');

        const quantity = Number(parts[0]);
        const timePeriod = parts[1].toLowerCase();

        this.quantity = quantity;
        this.timePeriod = Periods.filter(
            (period) => period.name === timePeriod
        )[0];

        if (isNaN(quantity)) {
            throw new Error('Invalid quantity specified!');
        }

        if (!timePeriod) {
            throw new Error('Invalid time period specified!');
        }

        return this;
    }

    public setResponse(response: Object): RateLimiter {
        this.response = response;
        return this;
    }

    /**
     * Sets the rate limit identifier callback
     * @param rateLimitIdentifier The rate limit identifier callback
     * @return The current RateLimiter instance
     */
    public setRateLimitIdentifier(
        rateLimitIdentifier: (request: Request) => string
    ): RateLimiter {
        this.rateLimitIdentifier = rateLimitIdentifier;
        return this;
    }

    /**
     * Sets the function to determine if a request bypasses rate limiting
     * @param bypassFunction The function, returning a boolean with whether
     * the sender should bypass rate limiting
     */
    public setBypass(
        bypassFunction: (request: Request) => boolean
    ): RateLimiter {
        this.bypassFunction = bypassFunction;
        return this;
    }

    /**
     * Handles the route's rate limiting
     * @param req The request instance
     * @returns If the handler should continue with the request
     */
    public async handle(req: Request): Promise<boolean> {
        if (this.bypassFunction(req)) {
            return true;
        }

        const identifier = this.rateLimitIdentifier(req);
        const key = identifier + '-rate-limit';

        const timePeriod = this.timePeriod;
        const quantity = this.quantity;

        let cachedData = await cache.get(key);

        if (!cachedData) {
            await cache.set(key, JSON.stringify([Date.now()]));
            return true;
        }

        const time = Date.now();

        cachedData = JSON.parse(cachedData);
        cachedData = cachedData.filter(
            (entry: Number) =>
                time - (entry as number) <= (timePeriod.durationTime as number)
        );
        cachedData.push(time);

        if (cachedData.length > quantity) {
            await cache.set(key, JSON.stringify(cachedData));
            return false;
        }

        await cache.set(key, JSON.stringify(cachedData));
        return true;
    }
}
