import { Route, DetailedRequest, Parameter, Method, Matcher } from '../src';
import RateLimitHandler from './RateLimit';

export default new Route(Method.POST, '/post-test')
    .setPostBodyFields([
        new Parameter()
            .setName('username')
            .setRequired(true)
            .setValidationFunction(
                (username) => Matcher.matchUsername(username) !== null
            ),
    ])
    .setRateLimitHandler(RateLimitHandler('5/minute'))
    .setHandler(async (req: DetailedRequest, res) => {
        const username = req.postBody.username;

        return res.status(200).json({
            status: 'success',
            data: {
                username: username,
            },
        });
    });
