module.exports = class Route {

    parameters = [];
    postBodyFields = [];
    rateLimitHandler;
    sandBoxResponse;

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

    setSandboxData(statusCode, data) {
        this.sandBoxResponse = {
            status: statusCode,
            data: data
        }
        return this;
    }

    /**
     * Sets the route handling function
     * @param handler The handling function
     * @returns The current Route instance
     */
    setHandler(handler) {
        this.handler = async (req, res) => {
            // In the future, this should be its own middleware, instead of being tied to the handler
            const value = await (!this.rateLimitHandler || this.rateLimitHandler.handle(req));

            if (value) {
                if (req.query.sandbox && this.sandBoxResponse) {
                    return res.status(this.sandBoxResponse.status).json(this.sandBoxResponse.data);
                }

                const query = req.query;
                const body = req.body;

                req.queryParams = {};
                req.postBody = {};

                for (const parameter of this.parameters) {
                    const result = parameter.test(req, query, req.queryParams);

                    if (typeof result === 'string') {
                        return res.status(400).json({
                            status: 'failed',
                            message: result
                        });
                    }
                }

                for (const field of this.postBodyFields) {
                    const result = field.test(req, body, req.postBody);

                    if (typeof result === 'string') {
                        return res.status(400).json({
                            status: 'failed',
                            message: result
                        });
                    }
                }

                return handler(req, res);
            }

            return res.status(429).json(this.rateLimitHandler.response);
        }

        return this;
    }
}
