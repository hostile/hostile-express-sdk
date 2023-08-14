const { Route, Parameter, RateLimitDescriptor} = require('../index');
const { standardizeUsername } = require('../core/parameter/standardization');

const axios = require('axios');
const createRateLimit = require('./rateLimit');

module.exports = new Route('GET', '/cashapp')
    .setSandboxData(200, {
        status: 'success',
        data: {
            name: 'John Smith'
        }
    })
    .setParameters([
        new Parameter()
            .setName('username')
            .setRequired(true)
            .setValidationFunction((username) => standardizeUsername(username))
    ]).setRateLimitHandler(
        createRateLimit('5/minute')
    ).setHandler(async (req, res) => {
        const username = req.queryParams.username;
        const response = await axios.get(`https://cash.app/$${username}`, {
            validateStatus: false
        });

        if (response.status !== 200) {
            return res.status(400).json({
                status: 'failed',
                message: 'No user found!'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                name: response.data.split('display_name":"')[1].split('"')[0].replace('"', '')
            }
        });
    });
