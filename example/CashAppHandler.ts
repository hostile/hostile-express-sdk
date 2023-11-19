import { Route, Parameter, Method, Matcher } from '../src';
import RateLimitHandler from './RateLimit';

import axios from 'axios';

module.exports = new Route(Method.GET, '/cashapp')
    .setSandboxData({
        status: 200,
        data: {
            status: 'success',
            data: {
                name: 'John Smith',
            },
        },
    })
    .setParameters([
        new Parameter()
            .setName('username')
            .setRequired(true)
            .setValidationFunction(
                (username) => Matcher.matchUsername(username) !== null
            ),
    ])
    .setRateLimitHandler(RateLimitHandler('5/minute'))
    .setHandler(async (req, res) => {
        const username = (req as any).queryParams.username;
        const response = await axios.get(`https://cash.app/$${username}`);

        if (response.status !== 200) {
            return res.status(400).json({
                status: 'failed',
                message: 'No user found!',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: {
                name: response.data
                    .split('display_name":"')[1]
                    .split('"')[0]
                    .replace('"', ''),
            },
        });
    });
