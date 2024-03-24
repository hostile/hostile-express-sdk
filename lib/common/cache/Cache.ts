export interface Cache<V> {
    connect(): void;

    set(key: string, value: V): Promise<void>;
    get(key: string): Promise<V | undefined>;
}

export let cache: Cache<any> | undefined = undefined;

export function setCache<V>(paramCache: Cache<V>): void {
    cache = paramCache;
}
