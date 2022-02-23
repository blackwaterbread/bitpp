export interface IStream {
    prices: PricesEntity[];
    account: AccountEntity[];
    positions: PositionsEntity[];
}

export interface PricesEntity {
    symbol: string;
    price: number;
    fundingFee: number;
    nextFundingTime: string;
    change: number;
    changePercent: number;
}

export interface AccountEntity {
    asset: string;
    walletBalance: number;
    unrealizedProfit: number;
    marginBalance: number;
    maintMargin: number;
    initialMargin: number;
    positionInitialMargin: number;
    openOrderInitialMargin: number;
    maxWithdrawAmount: number;
    crossWalletBalance: number;
    crossUnPnl: number;
    availableBalance: number;
}

export interface PositionsEntity {
    symbol: string;
    leverage: number;
    marginType: string;
    side: string;
    size: number;
    liqPrice: number;
    entryPrice: number;
    markPrice: number;
    margin: number;
    unrealizedProfit: number;
}
