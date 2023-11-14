import { Route, Parameter, Method, Matcher } from '../src';
import RateLimitHandler from './RateLimit';

module.exports = new Route(Method.POST, '/post-test')
    .setPostBodyFields([
        new Parameter()
            .setName('username')
            .setRequired(true)
            .setValidationFunction(
                (username) => Matcher.matchUsername(username) !== null
            ),
    ])
    .setRateLimitHandler(RateLimitHandler('5/minute'))
    .setHandler(async (req, res) => {
        const username = (req as any).postBody.username;

        return res.status(200).json({
            status: 'success',
            data: {
                username: username,
            },
        });
    });
