export function logVerbose(msg: string) {
    console.log(`${msg}`);
}

export function logNormal(msg: string) {
    console.log(`[Log] ${msg}`);
}

export function logError(msg: string) {
    console.error(`[Error] ${msg}`);
}

export function logWarning(msg: string) {
    console.warn(`[Warning] ${msg}`);
}

export function logRequest(msg: string) {
    console.log(`[Request] ${msg}`);
}