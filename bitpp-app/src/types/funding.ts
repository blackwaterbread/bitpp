export interface IFunding {
    incomes: IncomesEntity[];
    sum: SumEntity[];
}

export interface IncomesEntity {
    symbol: string;
    time: string;
    amount: number;
}

export interface SumEntity {
    symbol: string;
    amount: number;
}
