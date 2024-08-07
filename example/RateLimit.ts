import { RateLimiter } from '../lib';

export default (period: string) =>
    new RateLimiter().setPeriod(period).setResponse({
        status: 'failed',
        message: 'You are being rate limited!',
    });
