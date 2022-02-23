import Binance from 'node-binance-api';
import { PrismaClient } from '@prisma/client';
import * as math from 'mathjs';
import { ENVIRONMENT } from './config';
import { logError, logVerbose } from './log';
import { SYMBOL_BTCUSD, SYMBOL_ETHUSD } from './constants';
const prisma = new PrismaClient();

export const BinanceAPI: Binance = new Binance().options({
    APIKEY: ENVIRONMENT.APIKEY,
    APISECRET: ENVIRONMENT.APISECRET
});

const INTERVAL_FREQUENT = 1000;
const INTERVAL_MINUTE = 60000;

interface IBitppWorker {
    workerFrequent: NodeJS.Timeout,
    workerMinute: NodeJS.Timeout,
    workerDaily: NodeJS.Timeout
}

interface IMarkPrice {
    eventType: string,
    eventTime: number,
    symbol: string,
    markPrice: string,
    fundingRate: string,
    fundingTime: number
}

export function startMarkPriceStreams() {
    BinanceAPI.deliveryMarkPriceStream(SYMBOL_BTCUSD, workerMarkPrice, '@1s');
    BinanceAPI.deliveryMarkPriceStream(SYMBOL_ETHUSD, workerMarkPrice, '@1s');
}

async function workerMarkPrice(price: IMarkPrice) {
    const symbol = await prisma.markets.findUnique({
        where: { symbol: price.symbol }
    });
    if (symbol) {
        await prisma.markets.update({
            where: { symbol: price.symbol },
            data: {
                time: price.eventTime,
                price: math.number(price.markPrice) as number,
                fundingFee: math.number(math.multiply(math.fraction(price.fundingRate), math.number(100)) as math.Fraction) as number,
                nextFundingTime: price.fundingTime
            }
        });
    }
    else {
        await prisma.markets.create({
            data: {
                symbol: price.symbol,
                time: price.eventTime,
                price: math.number(price.markPrice) as number,
                fundingFee: math.number(math.multiply(math.fraction(price.fundingRate), math.number(100)) as math.Fraction) as number,
                nextFundingTime: price.fundingTime,
                change: 0,
                changePercent: 0,
            }
        });
    }
    // logVerbose(`[MarkPriceStream] ${price.symbol} | ${price.eventTime} | ${price.markPrice}$ | ${price.fundingRate}`);
}

async function workerFrequent() {
    try {
        const tasks = [];
        // 포지션에 변동 생기면 trades 갱신하게 하는 코드도 필요할듯 ?
        const assets = (await BinanceAPI.deliveryAccount()).assets.filter((v: any) => v.walletBalance !== '0.00000000');
        const positions = (await BinanceAPI.deliveryPositionRisk()).filter((v: any) => v.positionAmt !== "0");
        for (const asset of assets) {
            const symbol = await prisma.account.findUnique({
                where: { asset: asset.asset }
            });
            if (symbol) {
                tasks.push(
                    prisma.account.update({
                        where: { asset: asset.asset },
                        data: {
                            availableBalance: math.number(asset.availableBalance) as number,
                            crossUnPnl: math.number(asset.crossUnPnl) as number,
                            crossWalletBalance: math.number(asset.crossWalletBalance) as number,
                            initialMargin: math.number(asset.initialMargin) as number,
                            maintMargin: math.number(asset.maintMargin) as number,
                            marginBalance: math.number(asset.marginBalance) as number,
                            maxWithdrawAmount: math.number(asset.maxWithdrawAmount) as number,
                            openOrderInitialMargin: math.number(asset.openOrderInitialMargin) as number,
                            positionInitialMargin: math.number(asset.positionInitialMargin) as number,
                            unrealizedProfit: math.number(asset.unrealizedProfit) as number,
                            walletBalance: math.number(asset.walletBalance) as number
                        }
                    })
                );
            }
            else {
                tasks.push(
                    prisma.account.create({
                        data: {
                            asset: asset.asset,
                            availableBalance: math.number(asset.availableBalance) as number,
                            crossUnPnl: math.number(asset.crossUnPnl) as number,
                            crossWalletBalance: math.number(asset.crossWalletBalance) as number,
                            initialMargin: math.number(asset.initialMargin) as number,
                            maintMargin: math.number(asset.maintMargin) as number,
                            marginBalance: math.number(asset.marginBalance) as number,
                            maxWithdrawAmount: math.number(asset.maxWithdrawAmount) as number,
                            openOrderInitialMargin: math.number(asset.openOrderInitialMargin) as number,
                            positionInitialMargin: math.number(asset.positionInitialMargin) as number,
                            unrealizedProfit: math.number(asset.unrealizedProfit) as number,
                            walletBalance: math.number(asset.walletBalance) as number
                        }
                    })
                );
            }
        }

        for (const pos of positions) {
            const symbol = await prisma.positions.findUnique({
                where: { symbol: pos.symbol }
            });
            if (symbol) {
                tasks.push(
                    prisma.positions.update({
                        where: { symbol: pos.symbol },
                        data: {
                            leveraged: math.number(pos.leverage) as number,
                            side: Math.sign(math.number(pos.positionAmt) as number) === 1 ? 'Buy' : 'Sell',
                            entryPrice: math.number(pos.entryPrice) as number,
                            markPrice: math.number(pos.markPrice) as number,
                            liqPrice: math.number(pos.liquidationPrice) as number,
                            size: math.number(math.fraction(pos.notionalValue)) as number,
                            marginType: pos.marginType,
                            margin: math.number(math.fraction(pos.isolatedMargin - pos.unRealizedProfit)) as number,
                            unrealizedProfit: math.number(math.fraction(pos.unRealizedProfit)) as number
                        }
                    })
                );
            }
            else {
                tasks.push(
                    prisma.positions.create({
                        data: {
                            symbol: pos.symbol,
                            leveraged: math.number(pos.leverage) as number,
                            side: Math.sign(~~pos.positionAmt) === 1 ? 'Buy' : 'Sell',
                            entryPrice: math.number(pos.entryPrice) as number,
                            markPrice: math.number(pos.markPrice) as number,
                            liqPrice: math.number(pos.liquidationPrice) as number,
                            size: math.number(math.fraction(pos.notionalValue)) as number,
                            marginType: pos.marginType,
                            margin: math.number(math.fraction(pos.isolatedMargin - pos.unRealizedProfit)) as number,
                            unrealizedProfit: math.number(math.fraction(pos.unRealizedProfit)) as number
                        }
                    })
                );
            }
            // logVerbose(`[Worker-Frequent] ${pos.symbol} | PNL: ${pos.unRealizedProfit}`);
        }
        const [pricesBTC, pricesETH] = await Promise.all([
            BinanceAPI.deliveryDaily(SYMBOL_BTCUSD),
            BinanceAPI.deliveryDaily(SYMBOL_ETHUSD)
        ]);
        tasks.push(
            prisma.markets.update({
                where: { symbol: SYMBOL_BTCUSD },
                data: {
                    change: math.number(pricesBTC[0].priceChange) as number,
                    changePercent: math.number(pricesBTC[0].priceChangePercent) as number
                }
            }),
            prisma.markets.update({
                where: { symbol: SYMBOL_ETHUSD },
                data: {
                    change: math.number(pricesETH[0].priceChange) as number,
                    changePercent: math.number(pricesETH[0].priceChangePercent) as number
                }
            })
        );
        await Promise.all(tasks);
    }
    catch (e) {
        throw e;
        // logError(`Something's wrong with frequent Worker: ${e}`);
    }
}

async function workerMinute() {
    try {
        const lastFunding = await prisma.incomes.findFirst({ orderBy: { time: 'desc' } });
        const condition = lastFunding ? { startTime: Number(lastFunding.time) + 1 } : undefined;
        const incomes = await BinanceAPI.deliveryIncome({ 
            ...condition,
            incomeType: 'FUNDING_FEE',
            limit: 1000
        });
        if (incomes.length) {
            await prisma.incomes.createMany({
                data: incomes.map((x: any) => {
                    return {
                        symbol: x.symbol,
                        time: x.time,
                        amount: math.number(x.income) as number,
                        tranId: x.tranId.toString()
                    }
                })
            });
            logVerbose(`[Worker-Minute] New income: ${incomes.length}`);
        }
        else {
            logVerbose(`[Worker-Minute] There's no new income.`);
        }
    }
    catch (e) {
        logError(`Something's wrong with Minute Worker: ${e}`);
        // throw e;
    }
}

async function workerDaily() {
    // if (not daily's end)
    // return;
}

export function startWorker(): IBitppWorker {
    const workerFrq = setInterval(workerFrequent, INTERVAL_FREQUENT);
    const workerMin = setInterval(workerMinute, INTERVAL_MINUTE);
    const workerDay = setInterval(workerDaily, INTERVAL_FREQUENT);
    return {
        workerFrequent: workerFrq,
        workerMinute: workerMin,
        workerDaily: workerDay
    };
}