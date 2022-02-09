import { ParameterizedContext } from "koa";

export type AVAILABLE_HTTP_CODES = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 429 | 500;
const HTTP_CODE_MESSAGES = new Map<AVAILABLE_HTTP_CODES, string>([
    [200, 'OK'],
    [201, 'Created'],
    [204, 'No Contents'],
    [400, 'Bad Request'],
    [401, 'Unauthorized'],
    [403, 'Forbidden'],
    [404, 'Not Found'],
    [409, 'Conflict'],
    [429, 'Too Many Requests'],
    [500, 'Internal Server Error']
]);

export function response(ctx: ParameterizedContext, method: AVAILABLE_HTTP_CODES, response?: object | string) {
    ctx.response.status = method;
    if (typeof response === 'object') {
        ctx.response.body = response;
    }
    else if (typeof response === 'string') {
        ctx.response.body = {
            code: method,
            message: response
        };
    }
    else if (typeof response === 'undefined') {
        ctx.response.body = {
            code: method,
            message: HTTP_CODE_MESSAGES.get(method)
        };
    }
}