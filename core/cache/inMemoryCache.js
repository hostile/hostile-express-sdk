const Cache = require('./cache');

module.exports = class MemoryCache extends Cache {

    values = {};
    lastPurge = Date.now();
    purgeTimePeriod = 5000;
    cacheDuration = 30000;

    setPurgeTimePeriod(purgeTimePeriod) {
        this.purgeTimePeriod = purgeTimePeriod;
        return this;
    }

    setCacheDuration(cacheDuration) {
        this.cacheDuration = cacheDuration;
        return this;
    }

    set(key, value) {
        this.values[key] = {
            key: key,
            value: value,
            lastAccessTime: Date.now()
        };

        this.clear();
    }

    get(key) {
        const value = this.values[key];

        this.clear();

        if (!value) {
            return undefined;
        }

        return value.value;
    }

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