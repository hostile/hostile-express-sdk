import { config } from 'dotenv';
config();

// @ts-ignore
import express, { Express } from 'express';

import { API, LocalCache, GlobalConfig } from '../src';

GlobalConfig.cache = new LocalCache().setElementLifetime(60 * 60 * 1000);

/**
 * Initializes the API instance and app instance
 * Define host and port constants
 */
const api: API = new API(1, '/osint', []);
const app: Express = express();

app.use(express.json());

const host = process.env.HOST || '127.0.0.1';
const port: number = parseInt(process.env.PORT) || 3000;

/*
 * Add existing route to our API instance and register router
 */
api.addRoute(require('./cashAppHandler'));
api.addRoute(require('./examplePostTest'));

(async () => {
    api.registerMiddleware(app);
    await api.registerRoutes(app);
})().then(() => {
    /**
     * Listens for connections on the provided hostname and port
     */

    app.listen(port, host, () => {
        console.log(`Server started on http://${host}:${port}!`);
    });
});
