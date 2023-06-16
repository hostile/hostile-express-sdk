const { Cache } = require('./cache');

module.exports = class MemoryCache extends Cache {

    values = {};
    lastPurge = Date.now();
    purgeTimePeriod = 5000;
    lifetime = 30000;

    /**
     * Sets the purge cooldown
     * @param purgeTimePeriod The cooldown duration
     * @returns The current MemoryCache instance
     */
    setPurgeTimePeriod(purgeTimePeriod) {
        this.purgeTimePeriod = purgeTimePeriod;
        return this;
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
     * Gets the value of a key from the cache
     * @param key The key to return the value of
     * @returns The cached value
     */
    async get(key) {
        const value = this.values[key];

        this.clear();

        if (!value) {
            return undefined;
        }

        return value.value;
    }

    /**
     * Updates the value of an element within the cache
     * @param key The key to update the value of
     * @param value The value to be set
     */
    async set(key, value) {
        this.values[key] = {
            key: key,
            value: value,
            lastAccessTime: Date.now()
        };

        this.clear();
    }

    /**
     * Clears the expired values from the cache
     */
    clear() {
        if (Date.now() - this.lastPurge <= this.purgeTimePeriod) {
            return;
        }

        for (const key in this.values) {
            const entry = this.values[key];

            if (Date.now() - entry.lastAccessTime >= this.cacheDuration) {
                delete this.values[key];
            }
        }

        this.lastPurge = Date.now();
    }
}