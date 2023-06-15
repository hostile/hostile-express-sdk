const Middleware = require('./core/middleware');
const Route = require('./core/route');
const API = require('./core/api');

const Standardization = require('./core/parameter/standardization');
const Parameter = require('./core/parameter/parameter');

const RateLimitDescriptor = require('./core/ratelimit/rateLimitDescriptor');

const Cache = require('./core/cache/cache');
const MemoryCache = require('./core/cache/inMemoryCache');
const RedisCache = require('./core/cache/redisCache');

module.exports = {
    Middleware,
    Route,
    API,
    Standardization,
    Parameter,

    RateLimitDescriptor,

    MemoryCache,
    RedisCache,
    Cache
}