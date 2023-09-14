const { Route, Parameter } = require('../index');
const { standardizeUsername } = require('../core/parameter/standardization');

const createRateLimit = require('./rateLimit');

module.exports = new Route('POST', '/post-test')
    .setPostBodyFields([
        new Parameter()
            .setName('username')
            .setRequired(true)
            .setValidationFunction((username) => standardizeUsername(username))
    ]).setRateLimitHandler(
        createRateLimit('5/minute')
    ).setHandler(async (req, res) => {
        const username = req.postBody.username;

        res.status(200).json({
            status: 'success',
            data: {
                username: username
            }
        });
    });
