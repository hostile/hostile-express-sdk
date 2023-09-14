module.exports = {
    Cache: class RateLimitCache {

        connect() {
        }

        async set(key, value) {
            throw new Error(`Set function not overridden! ${key}:${value}`);
        }

        async get(key) {
            throw new Error(`Get function not overridden! ${key}`);
        }
    },

    cache: undefined
}