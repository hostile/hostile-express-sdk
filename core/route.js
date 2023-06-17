module.exports = class Route {

    parameters = [];
    postBodyFields = [];
    rateLimitHandler;

    handler;

    constructor(method, path) {
        this.method = method;
        this.path = path;
    }

    /**
     * Abstract test function, to be overridden by classes extending Route
     * @returns Whether the test is passed
     */
    test() {
        return true;
    }

    /**
     * Sets the expected parameters
     * @param params The expected parameters
     * @returns The current Route instance
     */
    setParameters(params) {
        this.parameters = params;
        return this;
    }

    /**
     * Sets the expected POST body fields
     * @param postFields The required post fields
     * @returns The current Route instance
     */
    setPostBodyFields(postFields) {
        this.postBodyFields = postFields;
        return this;
    }

    /**
     * Sets the rate limit handler
     * @param rateLimitHandler The rate limit handler
     * @returns The current Route instance
     */
    setRateLimitHandler(rateLimitHandler) {
        this.rateLimitHandler = rateLimitHandler;
        return this;
    }

    /**
     * Sets the route handling function
     * @param handler The handling function
     * @returns The current Route instance
     */
    setHandler(handler) {
        this.handler = async (req, res) => {
            const value = await (!this.rateLimitHandler || this.rateLimitHandler.handle(req));

            if (value) {
                const query = req.query;
                const body = req.body;

                req.queryParams = {};
                req.postBody = {};

                for (const parameter of this.parameters) {
                    if (!parameter.test(req, query)) {
                        res.status(400).json({
                            status: 'failed',
                            message: `Missing query parameter ${parameter.name}`
                        });
                        return;
                    }
                }

                for (const field of this.postBodyFields) {
                    if (!field.test(req, body)) {
                        res.status(400).json({
                            status: 'failed',
                            message: `Missing post body field ${field.name}`
                        });
                        return;
                    }
                }

                handler(req, res);
            } else {
                res.status(429).json(this.rateLimitHandler.response);
            }
        }
        return this;
    }
}
