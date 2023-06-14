// middleware class
class Middleware {

    parameters = []

    constructor() {}

    setParameters(params) { this.parameters = params; }

    // abstract standardize func
    use() {}

    setUse(fn) { this.use = fn; }

}

module.exports = Middleware