import { Cache } from './Cache';

interface CacheEntry<T> {
    value: T;
    lastAccessTime: Number;
}

export class LocalCache<V> extends Cache<V> {
    private values: { [key: string]: CacheEntry<V> } = {};
    private lastPurge: Number = Date.now();
    private purgeTimePeriod: Number = 5000;
    private lifetime: Number = 30000;

    /**
     * Sets the purge cooldown
     * @param purgeTimePeriod The cooldown duration
     * @returns The current MemoryCache instance
     */
    public setPurgeTimePeriod(purgeTimePeriod: Number): LocalCache<V> {
        this.purgeTimePeriod = purgeTimePeriod;
        return this;
    }

    /**
     * Sets the lifetime of cache elements
     * @param lifetime The lifetime of cache elements
     * @returns The current MemoryCache instance
     */
    public setElementLifetime(lifetime: Number): LocalCache<V> {
        this.lifetime = lifetime;
        return this;
    }

    /**
     * Gets the value of a key from the cache
     * @param key The key to return the value of
     * @returns The cached value
     */
    public async get(key: string): Promise<V | undefined> {
        const value = this.values[key];

        this.clear();

        return value ? value.value : undefined;
    }

    /**
     * Updates the value of an element within the cache
     * @param key The key to update the value of
     * @param value The value to be set
     */
    public async set(key: string, value: V): Promise<void> {
        this.values[key] = {
            value: value,
            lastAccessTime: Date.now(),
        };

        this.clear();
    }

    /**
     * Clears the expired values from the cache
     */
    public clear(): void {
        if (
            Date.now() - (this.lastPurge as number) <=
            (this.purgeTimePeriod as number)
        ) {
            return;
        }

        for (const key in this.values) {
            const entry = this.values[key];

            if (
                Date.now() - (entry.lastAccessTime as number) >=
                (this.lifetime as number)
            ) {
                delete this.values[key];
            }
        }

        this.lastPurge = Date.now();
    }
}
