import { DateTime } from 'luxon';

function now() {
    return DateTime.now().toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

export function logVerbose(msg: string) {
    console.log(`${msg}`);
}

export function logNormal(msg: string) {
    console.log(`[Log][${now()}]: ${msg}`);
}

export function logError(msg: string) {
    console.error(`${now()} | [Error] ${msg}`);
}

export function logWarning(msg: string) {
    console.warn(`${now()} | [Warning] ${msg}`);
}

export function logRequest(msg: string) {
    console.log(`${now()} | [Request] ${msg}`);
}