const { createClient } = require('redis');
const { Cache } = require('./cache');

module.exports = class RedisCache extends Cache {

    constructor(redisUrl) {
        super();

        this.client = createClient({
            url: redisUrl
        });
    }

    /**
     * Connects to the Redis instance
     */
    async connect() {
        await this.client.connect();
    }

    /**
     * Returns the value of the key from the Redis cache
     * @param key The key to check
     * @returns The value from the Redis cache
     */
    async get(key) {
        return await this.client.GET(key);
    }

    /**
     * Updates the value of the key in the Redis cache
     * @param key The key to set the value of
     * @param value The value to be set
     */
    async set(key, value) {
        await this.client.set(key, value);
    }
}