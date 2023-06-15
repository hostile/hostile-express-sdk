module.exports = class RateLimitCache {

    connect() {}

    set(key, value) {
        throw new Error(`Set function not overridden! ${key}:${value}`);
    }

    get(key) {
        throw new Error(`Get function not overridden! ${key}`);
    }
}