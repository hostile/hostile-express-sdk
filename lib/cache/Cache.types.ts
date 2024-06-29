export interface ExpressCache<V> {
    connect?(): void;

    set(key: string, value: V): Promise<void>;
    get(key: string): Promise<V | undefined>;
}

export let cache: ExpressCache<any> | undefined = undefined;

export function setCache<V>(paramCache: ExpressCache<V>): void {
    cache = paramCache;
}
