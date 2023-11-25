import { createClient, RedisClientOptions } from 'redis';
import { Cache } from './Cache';

export class RedisCache extends Cache<string> {
    client: any;
    connectionEstablished: boolean | undefined = undefined;
    lifetime: Number;

    constructor(redisOptions: RedisClientOptions) {
        super();

        this.client = createClient(redisOptions);

        try {
            this.connect().then(() => {
                this.connectionEstablished = true;

                console.log('Connected to Redis!');
            });
        } catch (exc: any) {
            this.connectionEstablished = false;
        }
    }

    /**
     * Connects to the Redis instance
     */
    public async connect(): Promise<void> {
        await this.client.connect();
    }

    /**
     * Sets the lifetime of cache elements
     * @param lifetime The lifetime of cache elements
     * @returns The current MemoryCache instance
     */
    public setElementLifetime(lifetime: Number): RedisCache {
        this.lifetime = lifetime;
        return this;
    }

    /**
     * Returns the value of the key from the Redis cache
     * @param key The key to check
     * @returns The value from the Redis cache
     */
    async get(key: string): Promise<string> {
        this.awaitCompletion();
        return await this.client.get(key);
    }

    /**
     * Updates the value of the key in the Redis cache
     * @param key The key to set the value of
     * @param value The value to be set
     */
    async set(key: string, value: string): Promise<void> {
        this.awaitCompletion();
        await this.client.set(
            key,
            value,
            Date.now() + (this.lifetime as number)
        );
    }

    private awaitCompletion(): boolean {
        while (this.connectionEstablished === undefined) {
            setTimeout(null, 50);
        }

        if (!this.connectionEstablished) {
            throw new Error('Failed to establish redis connection!');
        }

        return true;
    }
}
