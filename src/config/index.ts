import { Request } from 'express';
import { RateLimiter } from '../ratelimit';
import { Cache, setCache } from '../common/cache';

import * as AWS from 'aws-sdk';

export interface AWSConfig {
    accessKey: string;
    secretKey: string;
    region: string;
}

class Config {
    requestSandboxable: (request: Request) => boolean = () => false;
    defaultRateLimitHandler?: RateLimiter;
    defaultRateLimitBuilder?: (max: string) => RateLimiter;
    requiredOrigin: string[];
    host?: string;
    port: Number;

    set cache(cache: Cache<any>) {
        setCache(cache);
    }

    set awsConfig(awsConfig: AWSConfig) {
        AWS.config.update(awsConfig);
    }
}

export const GlobalConfig = new Config();
