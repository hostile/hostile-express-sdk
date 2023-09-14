module.exports = class Middleware {

    constructor() {}

    /**
     * Abstract usage method
     */
    async use(req, res, next) {
        throw new Error('Middleware function not overridden!');
    }

    /**
     * Sets the handler
     * @param fn The handler function
     */
    setUse(fn) {
        this.use = fn;
    }
}
