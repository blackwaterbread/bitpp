import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import { SYMBOL_BTCUSD, SYMBOL_ETHUSD } from '../../lib/constants';
import { response } from '../../lib/http';
const routerV1 = new Router();
const prisma = new PrismaClient();

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