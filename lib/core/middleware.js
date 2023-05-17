// middleware class
class Middleware {

    constructor() {}

    // abstract standardize func
    use() {}

    setUse(fn) { this.use = fn; }

}

module.exports = Middleware