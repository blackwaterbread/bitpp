import Koa from 'koa';
import cors from '@koa/cors';
import body from 'koa-body';
import logger from 'koa-logger';
import rateLimit from 'koa-ratelimit';
import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { ENVIRONMENT, RateLimitOptions } from './lib/config';
import rootRouter from './router';
import { logError, logNormal } from './lib/log';
import { startMarkPriceStreams, startWorker } from './lib/binance';
import { registerListeners } from './lib/ws';
const prisma = new PrismaClient();

function startKoaServer() {
    const { SERVER_HOST, SERVER_PORT } = ENVIRONMENT;
    const app = new Koa();
    app
        .use(cors())
        .use(body())
        .use(logger())
        .use(rateLimit(RateLimitOptions))
        .use(rootRouter.routes())
        .use(rootRouter.allowedMethods());
    const server = app.listen(SERVER_PORT, SERVER_HOST, 
        () => {
            logNormal(`Server is now running: ${SERVER_HOST}:${SERVER_PORT}`);
        }
    );
    return server;
}

function startWebSocketServer(server: Server) {
    const wsServer = new WebSocket.Server({ server });
    registerListeners(wsServer);
    return wsServer;
}

async function app() {
    try {
        const server = startKoaServer();
        const wss = startWebSocketServer(server);
        const watchCryptos = (await prisma.positions.findMany()).map(x => x.symbol);
        startMarkPriceStreams(watchCryptos);
        startWorker();
        return server;
    }
    catch (e) {
        logError(`Cannot initalize server: ${e}`);
        throw e;
    }
}

app()
    .catch((err) => console.error(err));