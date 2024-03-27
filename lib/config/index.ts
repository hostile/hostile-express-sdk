import { Request } from 'express';
import { RateLimiter } from '../ratelimit';
import { Cache, setCache } from '../common';

import * as AWS from 'aws-sdk';

export interface DefaultsConfig {
    host?: string;
    port?: number;
    rateLimitHandler?: RateLimiter;
    rateLimitHandlerBuilder?: (max: string) => RateLimiter;
    canRequestUseSandbox?: (request: Request) => boolean;
}

export interface AWSConfig {
    accessKey: string;
    secretKey: string;
    region: string;
}

export class Config implements DefaultsConfig {
    canRequestUseSandbox: (request: Request) => boolean;
    defaultRateLimitBuilder?: (max: string) => RateLimiter;
    defaultRateLimitHandler?: RateLimiter;

    host?: string;
    port?: number;

    constructor(config: NodeJS.Dict<any> | (DefaultsConfig & AWSConfig) = {}) {
        this.host = config.host;
        this.port = config.port;

        this.defaultRateLimitHandler = config.rateLimitHandler;
        this.defaultRateLimitBuilder = config.rateLimitHandlerBuilder;
        this.canRequestUseSandbox = config.canRequestUseSandbox || ((_req: Request) => false);
    }

    set cache(cache: Cache<any>) {
        setCache(cache);
    }

    set awsConfig(awsConfig: AWSConfig) {
        AWS.config.update(awsConfig);
    }
}

export const GlobalConfig = new Config();
