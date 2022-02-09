import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import { SYMBOL_BTCUSD, SYMBOL_ETHUSD } from '../../lib/constants';
import { response } from '../../lib/http';
const routerV1 = new Router();
const prisma = new PrismaClient();

routerV1.get('/market', async (ctx, next) => {
    try {
        const markets = (await prisma.markets.findMany()).map(x => {
            return {
                symbol: x.symbol,
                price: x.price,
                fundingFee: x.fundingFee,
                nextFundingTime: x.nextFundingTime.toString(),
                change: x.change,
                changePercent: x.changePercent
            };
        });
        response(ctx, 200, markets);
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
});

routerV1.get('/account', async (ctx, next) => {
    try {
        const assets = (await prisma.account.findMany()).map(x => {
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
        });
        const positions = (await prisma.positions.findMany()).map(x => {
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
        });
        response(ctx, 200, {
            assets: assets,
            positions: positions
        });
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
})

routerV1.get('/assets', async (ctx, next) => {
    try {
        const assets = (await prisma.account.findMany()).map(x => {
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
        });
        response(ctx, 200, assets);
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
});

routerV1.get('/positions', async (ctx, next) => {
    try {
        const positions = (await prisma.positions.findMany()).map(x => {
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
        });
        response(ctx, 200, positions);
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
});

routerV1.get('/incomes/sum', async (ctx, next) => {
    try {
        const [sumBTC, sumETH] = await Promise.all([
            prisma.incomes.aggregate({
                _sum: { amount: true },
                where: { symbol: SYMBOL_BTCUSD }
            }),
            prisma.incomes.aggregate({
                _sum: { amount: true },
                where: { symbol: SYMBOL_ETHUSD }
            })
        ]);
        response(ctx, 200, [
            {
                symbol: SYMBOL_BTCUSD,
                amount: sumBTC._sum.amount
            },
            {
                symbol: SYMBOL_ETHUSD,
                amount: sumETH._sum.amount
            }
        ]);
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
});

routerV1.get('/incomes/list', async (ctx, next) => {
    try {
        // todo: response에 (truncated, max page) 추가
        const { page } = ctx.query;
        const cPage = Number(page) - 1;
        const incomes = (await prisma.incomes.findMany({
            skip: isNaN(cPage) ? 0 : cPage * 10,
            take: 10,
            orderBy: {
                time: 'desc'
            }
        }))
        .map(x => {
            return {
                symbol: x.symbol,
                time: x.time.toString(),
                amount: x.amount
            };
        });
        response(ctx, 200, incomes);
    }
    catch (e) {
        response(ctx, 400);
        throw e;
    }
});

export default routerV1;