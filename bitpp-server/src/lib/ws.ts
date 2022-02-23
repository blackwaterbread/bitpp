import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';
import { logNormal } from './log';
const prisma = new PrismaClient();

const INTERVAL_BROADCAST = 1000;
interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

export function registerListeners(wss: WebSocket.Server) {
    wss.on('connection', (ws: ExtWebSocket, req) => {
        const reqAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        logNormal(`[WSS]: New Connection: ${reqAddress}`);
        ws.isAlive = true;
        ws.on('pong', handlerHeartbeat);
        ws.on('close', () => {
            logNormal(`[WSS]: Disconnected: ${reqAddress}`);
        });
        ws.on('error', (error) => {
            console.error(`[WSS]: Error: [${reqAddress}]: ${error}`);
        });
    });

    const stream = setInterval(() => {
        wss.clients.forEach(async socket => {
            const extSocket = socket as ExtWebSocket;
            if (extSocket.isAlive === false) {
                return extSocket.terminate();
            }
            else {
                getStreamResponse().then(
                    response => {
                        extSocket.send(response);
                        extSocket.ping();
                        extSocket.isAlive = false;
                    }
                );
            }
        });
    }, INTERVAL_BROADCAST);

    wss.on('close', () => {
        clearInterval(stream);
    });
}

function handlerHeartbeat(this: WebSocket, data: Buffer) {
    const extWs = this as ExtWebSocket;
    extWs.isAlive = true;
}

async function getStreamResponse() {
    try {
        const [markets, assets, positions] = await Promise.all([
            prisma.markets.findMany(),
            prisma.account.findMany(),
            prisma.positions.findMany()
        ]);
        const response = {
            prices: markets.map(x => {
                return {
                    symbol: x.symbol,
                    price: x.price,
                    fundingFee: x.fundingFee,
                    nextFundingTime: x.nextFundingTime.toString(),
                    change: x.change,
                    changePercent: x.changePercent
                }
            }),
            account: assets.map(x => {
                return {
                    asset: x.asset,
                    walletBalance: x.walletBalance,
                    unrealizedProfit: x.unrealizedProfit,
                    marginBalance: x.marginBalance,
                    maintMargin: x.maintMargin,
                    initialMargin: x.initialMargin,
                    positionInitialMargin: x.positionInitialMargin,
                    openOrderInitialMargin: x.openOrderInitialMargin,
                    maxWithdrawAmount: x.maxWithdrawAmount,
                    crossWalletBalance: x.crossWalletBalance,
                    crossUnPnl: x.crossUnPnl,
                    availableBalance: x.availableBalance
                }
            }),
            positions: positions.map(x => {
                return {
                    symbol: x.symbol,
                    leverage: x.leveraged,
                    marginType: x.marginType,
                    side: x.side,
                    size: x.size,
                    liqPrice: x.liqPrice,
                    entryPrice: x.entryPrice,
                    markPrice: x.markPrice,
                    margin: x.margin,
                    unrealizedProfit: x.unrealizedProfit
                };
            })
        }
        return JSON.stringify(response);
    }
    catch (e) {
        console.error(e);
    }
}