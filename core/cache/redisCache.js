const { createClient } = require('redis');
const { Cache } = require('./cache');

module.exports = class RedisCache extends Cache {

    constructor(redisOptions) {
        super();

        this.client = createClient(redisOptions);
        this.connect().then(() => {
            console.log('Connected to Redis!');
        })
    }

    /**
     * Connects to the Redis instance
     */
    async connect() {
        await this.client.connect();
    }

    /**
     * Sets the lifetime of cache elements
     * @param lifetime The lifetime of cache elements
     * @returns The current MemoryCache instance
     */
    setElementLifetime(lifetime) {
        this.lifetime = lifetime;
        return this;
    }

    /**
     * Returns the value of the key from the Redis cache
     * @param key The key to check
     * @returns The value from the Redis cache
     */
    async get(key) {
        return await this.client.get(key);
    }

    /**
     * Updates the value of the key in the Redis cache
     * @param key The key to set the value of
     * @param value The value to be set
     */
    async set(key, value) {
        await this.client.set(key, value, Date.now() + this.lifetime);
    }
}