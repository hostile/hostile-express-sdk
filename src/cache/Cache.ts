export class Cache<V> {
    public connect(): void {}

    public async set(key: string, value: V): Promise<void> {
        throw new Error(`Set function not overridden! ${key}:${value}`);
    }

    public async get(key: string): Promise<V | undefined> {
        throw new Error(`Get function not overridden! ${key}`);
    }

    public async getOrDefault(key: string, defaultValue: V): Promise<V> {
        return (await this.get(key)) || defaultValue;
    }
}

export let cache: Cache<any> | undefined = undefined;

export function setCache<V>(paramCache: Cache<V>): void {
    cache = paramCache;
}
