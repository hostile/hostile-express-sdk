const periods = require('./rateLimitPeriod');
const cache = require('../cache/cache');

module.exports = class RateLimitDescriptor {

    response = {
        status: 'failed',
        message: 'You are being rate limited! Try slowing down your requests.'
    }

    rateLimitIdentifier = (req) => {
        return req.header('x-forwarded-for') || req.socket.remoteAddress;
    }

    bypassFunction = (req) => {
        return false;
    }

    constructor() {}

    /**
     * Sets the time period of the rate limiting descriptor
     * @param period The period to be used to determine if a request is valid
     * @returns The RateLimitDescriptor instance
     */
    setPeriod(period) {
        const parts = period.split('/');

        const quantity = Number(parts[0]);
        const timePeriod = parts[1].toLowerCase();

        if (isNaN(quantity)) {
            throw new Error('Invalid quantity specified!');
        }

        if (!(timePeriod in periods)) {
            throw new Error('Invalid time period specified!');
        }

        this.quantity = quantity;
        this.timePeriod = periods[timePeriod];

        return this;
    }

    setResponse(response) {
        this.response = response;
        return this;
    }

    /**
     * Sets the rate limit identifier callback
     * @param rateLimitIdentifier The rate limit identifier callback
     * @return The current RateLimitDescriptor instance
     */
    setRateLimitIdentifier(rateLimitIdentifier) {
        this.rateLimitIdentifier = rateLimitIdentifier;
        return this;
    }

    /**
     * Sets the function to determine if a request bypasses rate limiting
     * @param bypassFunction The function, returning a boolean with whether
     * the sender should bypass rate limiting
     */
    setBypass(bypassFunction) {
        this.bypassFunction = bypassFunction;
        return this;
    }

    /**
     * Handles the route's rate limiting
     * @param req The request instance
     * @returns If the handler should continue with the request
     */
    async handle(req) {
        if (this.bypassFunction(req)) {
            return true;
        }

        const identifier = this.rateLimitIdentifier(req);
        const key = identifier + '-rate-limit';

        const timePeriod = this.timePeriod;
        const quantity = this.quantity;

        let cachedData = await cache.cache.get(key);

        if (!cachedData) {
            await cache.cache.set(key, [Date.now()]);
            return true;
        }

        const time = Date.now();

        cachedData = cachedData.filter(entry => time - entry <= timePeriod);
        cachedData.push(time);

        if (cachedData.length > quantity) {
            await cache.cache.set(key, cachedData);
            return false;
        }

        await cache.cache.set(key, cachedData);
        return true;
    }
}