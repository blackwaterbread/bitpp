import Koa from 'koa';
import cors from '@koa/cors';
import body from 'koa-body';
import logger from 'koa-logger';
import rateLimit from 'koa-ratelimit';
import { ENVIRONMENT, RateLimitOptions } from './lib/config';
import rootRouter from './router';
import { logNormal } from './lib/log';
import { startMarkPriceStreams, startWorker } from './lib/binance';

function createServerInstance(): Koa {
    const app = new Koa();
    app
        .use(cors())
        .use(body())
        .use(logger())
        .use(rateLimit(RateLimitOptions))
        .use(rootRouter.routes())
        .use(rootRouter.allowedMethods());
    return app;
}

function startServer(instance: Koa) {
    const { SERVER_HOST, SERVER_PORT } = ENVIRONMENT;
    const server = instance.listen(SERVER_PORT, SERVER_HOST, 
        async () => {
            logNormal(`Server is now running: ${SERVER_HOST}:${SERVER_PORT}`);
        }
    );
    return server;
}

const app = createServerInstance();
const server = startServer(app);
startMarkPriceStreams();
startWorker();
export default server;