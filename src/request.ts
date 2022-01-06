import https from 'https';
import type { OutgoingHttpHeaders } from 'http';
import { SafeJsonParse } from './util.js';
import { API_PATH, TokenTypes } from './helpers.js';

const
    DEFAULT_CONNECTION_TIMEOUT = 5000,
    DEFAULT_RETRY_COUNT = 5;

export class Authorization {
    private _type: TokenTypes;
    private _token: string;
    private _cache!: string;

    constructor(token: string, type: TokenTypes = TokenTypes.BOT) {
        this._token = token;
        this._type = type;
        this._update();
    }

    private _update = () =>
        this._cache = this._type ?
            `${this._type} ${this._token}` :
            this._token;

    get type() { return this._type; };
    set type(value: TokenTypes) { this._type = value; this._update(); };

    get token() { return this._token; };
    set token(value: string) { this._token = value; this._update(); };

    get value() { return this._cache; };
    toString = () => this._cache;
};

const enum Headers {
    ContentType = 'Content-Type',
    ContentLength = 'Content-Length',
    Authorization = 'Authorization',
}

const enum ContentTypes {
    Form = 'application/x-www-form-urlencoded',
    Json = 'application/json',
}

export type RequestOptions = {
    authorization?: Authorization;
    connectionTimeout?: number;
    rateLimit?: {
        retryCount?: number;
        callback?: (response: { message: string; retry_after: number; global: boolean; }, attempts: number) => void;
    };
};

let defOptions: RequestOptions | undefined;

// @internal
export const SetDefOptions = (options?: RequestOptions) => defOptions = options;

// @internal
export const Request = (method: string, endpoint: string, options = defOptions, data?: object | string | null) => {
    let content: string;

    const headers: OutgoingHttpHeaders = {};

    if(data) {
        if(typeof data == 'string') {
            headers[Headers.ContentType] = ContentTypes.Form;
            headers[Headers.ContentLength] = Buffer.byteLength(content = data);
        } else {
            headers[Headers.ContentType] = ContentTypes.Json;
            headers[Headers.ContentLength] = Buffer.byteLength(content = JSON.stringify(data));
        }
    }

    if(options?.authorization instanceof Authorization)
        headers[Headers.Authorization] = String(options.authorization);

    const requestOptions: https.RequestOptions = {
        method,
        headers,
        timeout: options?.connectionTimeout ?? DEFAULT_CONNECTION_TIMEOUT,
    };

    const
        url = `${API_PATH}/${endpoint}`,
        retryCount = options?.rateLimit?.retryCount ?? DEFAULT_RETRY_COUNT,
        rateLimitCallback = options?.rateLimit?.callback;

    return new Promise<any>((resolve, reject) => {
        let attempts = 0;

        const TryRequest = () => {
            HttpsRequest(url, requestOptions, content).then((result) => {
                const code = result.code;

                if((code >= 200) && (code < 300))
                    return resolve(SafeJsonParse(result.data));

                if((code >= 400) && (code < 500)) {
                    const response = SafeJsonParse(result.data);
                    if(code != 429)
                        return reject({ code, response });

                    attempts++;
                    rateLimitCallback?.(response, attempts);

                    return (response.retry_after && (attempts < retryCount)) ?
                        setTimeout(TryRequest, Math.ceil(Number(response.retry_after) * 1000)) :
                        reject({ code, response });
                }

                reject({ code });
            }).catch(reject);
        };

        TryRequest();
    });
};

const HttpsRequest = (url: string, options: https.RequestOptions, content?: string | Buffer) =>
    new Promise<{ code: number; data?: string; }>((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            const code = response.statusCode;
            if(!code) return reject('Unknown response.');

            const ReturnResult = (data?: string) => resolve({ code, data });

            const chunks: Buffer[] = [];
            let totalLength = 0;

            response.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
                totalLength += chunk.length;
            });

            response.on('end', () => {
                if(!response.complete)
                    return reject('Response error.');

                if(totalLength == 0)
                    return ReturnResult();

                if(chunks.length == 1)
                    return ReturnResult(String(chunks[0]));

                return ReturnResult(String(Buffer.concat(chunks, totalLength)));
            });
        });

        request.on('error', reject);
        request.on('timeout', () => reject('Request timeout.'));

        request.end(content);
    });
