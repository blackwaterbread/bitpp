import fs from 'fs';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import { MiddlewareOptions } from 'koa-ratelimit';

export const PAGE_LIMIT_MAX = 100;
export const PAGE_LIMIT_DEFAULT = 20;
export const INTERVAL_WORKER = 1000; // ms
export const ENVIRONMENT = loadEnvConfigs();

export interface IEnvConfigs {
    ENVIRONMENT: string,
    SERVER_HOST: string,
    SERVER_PORT: number,
    REDIS_HOST: string,
    REDIS_PORT: number,
    DATABASE_URL: string,
    APIKEY: string,
    APISECRET: string,
    RATE_DURATION: number,
    RATE_COUNTS: number
}

export function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}

export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

// mysql://root:korone@127.0.0.1:3306/bitpp
function loadEnvConfigs(): IEnvConfigs {
    try {
        dotenv.config({ path: '.env' });
        return {
            ENVIRONMENT: process.env.NODE_ENV!,
            SERVER_HOST: process.env.SERVER_HOST!,
            SERVER_PORT: Number(process.env.SERVER_PORT!),
            REDIS_HOST: process.env.REDIS_HOST!,
            REDIS_PORT: Number(process.env.REDIS_PORT!),
            DATABASE_URL: process.env.DATABASE_URL!,
            APIKEY: process.env.APIKEY!,
            APISECRET: process.env.APISECRET!,
            RATE_DURATION: Number(process.env.RATE_DURATION!),
            RATE_COUNTS: Number(process.env.RATE_COUNTS!)
        };
    }
    catch (error: any) {
        throw new Error(`잘못된 NODE_ENV 설정: ${error.message}`);
    }
}

export function loadJsonConfigs(path: string) {
    try {
        const buffer = fs.readFileSync(path);
        return JSON.parse(buffer.toString());
    }
    catch (e) {
        throw new Error(`loadConfigs 오류: ${e}`);
    }
}

export const RateLimitOptions: MiddlewareOptions = {
    driver: 'redis',
    db: new Redis(),
    id: (ctx) => ctx.ip,
    duration: ENVIRONMENT.RATE_DURATION * 1000,
    max: ENVIRONMENT.RATE_COUNTS
};