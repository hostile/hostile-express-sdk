module.exports = class Middleware {

    constructor() {}

    /**
     * Abstract usage method
     */
    use(req, res, next) {
        throw new Error('Middleware function not overridden!');
    }

    /**
     * Sets the use function
     * @param fn The use function
     */
    setUse(fn) {
        this.use = fn;
    }
}
