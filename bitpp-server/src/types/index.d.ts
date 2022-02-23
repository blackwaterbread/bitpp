import oWebSocket from 'ws';

declare module 'ws' {
    export interface WebSocket extends oWebSocket {
        isAlive: boolean;
    }
}