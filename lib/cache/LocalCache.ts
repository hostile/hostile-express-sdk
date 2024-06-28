import { ExpressCache } from './Cache.types';

export interface CacheEntry<T> {
    value: T;
    lastAccessTime: number;
}

export class LocalCache<V> implements ExpressCache<V> {
    private values: NodeJS.Dict<CacheEntry<V>> = {};

    private lastPurge: number = Date.now();
    private purgeTimePeriod: number = 5000;
    private lifetime: number = 30000;

    /**
     * Sets the purge cooldown
     * @param purgeTimePeriod The cooldown duration
     * @returns The current MemoryCache instance
     */
    public setPurgeTimePeriod(purgeTimePeriod: number): LocalCache<V> {
        this.purgeTimePeriod = purgeTimePeriod;
        return this;
    }

    /**
     * Sets the lifetime of cache elements
     * @param lifetime The lifetime of cache elements
     * @returns The current MemoryCache instance
     */
    public setElementLifetime(lifetime: number): LocalCache<V> {
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
        if (Date.now() - this.lastPurge <= this.purgeTimePeriod) {
            return;
        }

        Object.keys(this.values)
            .filter((key: string) => {
                return Date.now() - this.values[key].lastAccessTime >= this.lifetime;
            })
            .forEach((key) => delete this.values[key]);

        this.lastPurge = Date.now();
    }
}
