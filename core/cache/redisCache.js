const { createClient } = require('redis');
const Cache = require('./cache');

module.exports = class RedisCache extends Cache {

    constructor(redisUrl) {
        super();

        this.client = createClient({
            url: redisUrl
        });
    }

    async connect() {
        await this.client.connect();
    }

    get(key) {
        throw new Error('Get cannot be called synchronously using Redis cache!');
    }

    set(key, value) {
        throw new Error('Set cannot be called synchronously using Redis cache!');
    }

    async setAsync(key, value) {
        await this.client.set(key, value);
    }

    async getAsync(args) {
        return await this.client.GET(args);
    }
}