import { Colors } from "./theme";

export const SYMBOL_BTCUSD = 'BTCUSD_PERP';
export const SYMBOL_ETHUSD = 'ETHUSD_PERP';

interface ISymbol {
    [index: string]: string
}

export const Symbols: ISymbol = {
    BTCUSD_PERP: 'BTCUSD 무기한',
    ETHUSD_PERP: 'ETHUSD 무기한'
};

export const MarginTypes: ISymbol = {
    isolated: '격리',
    crossed: '교차'
}

export function getPrefix(value: number) {
    return Math.sign(value) === 1 ? '+' : '';
}

export function getPriceColor(value: number) {
    return Math.sign(value) === 1 ? Colors.bull : Colors.bear;
}