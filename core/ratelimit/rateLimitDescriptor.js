const periods = require('./rateLimitPeriod');

module.exports = class RateLimitDescriptor {

    constructor() {}

    rateLimitIdentifier = (req) => {
        return req.header('x-forwarded-for') || req.socket.remoteAddress;
    }

    bypassFunction = (req) => {
        return false;
    }

    /**
     * Sets the time period of the rate limiting descriptor
     * @param period The period to be used to determine if a request is valid
     * @returns The RateLimitDescriptor instance
     */
    setPeriod(period) {
        const parts = period.split('/');

        const duration = Number(parts[0]);
        const timePeriod = parts[1].toLowerCase();

        if (isNaN(duration)) {
            throw new Error('Invalid duration specified!');
        }

        if (!(timePeriod in periods)) {
            throw new Error('Invalid time period specified!');
        }

        this.duration = duration;
        this.timePeriod = timePeriod;

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
}