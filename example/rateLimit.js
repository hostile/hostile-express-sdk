const { RateLimitDescriptor} = require('../index');

module.exports = (period) => new RateLimitDescriptor()
    .setPeriod(period)
    .setResponse({
        status: 'failed',
        message: 'You are being rate limited!'
    });