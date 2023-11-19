import { Request } from 'express';
import { RateLimiter } from '../ratelimit';
import { Cache, setCache } from '../cache';

class Config {
    requestSandboxable: (request: Request) => boolean = () => false;
    defaultRateLimitHandler?: RateLimiter;
    defaultRateLimitBuilder?: (max: string) => RateLimiter;

    set cache(cache: Cache<any>) {
        setCache(cache);
    }
}

export const GlobalConfig = new Config();
