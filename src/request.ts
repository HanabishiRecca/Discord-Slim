import https from 'https';
import { URL } from 'url';
import { SafeJsonParse } from './util';
import { API_PATH } from './helpers';

const
    DEFAULT_RETRY_TIMEOUT = 1000,
    DEFAULT_CONNECTION_TIMEOUT = 5000,
    DEFAULT_RETRY_COUNT = 5;

export enum TokenTypes {
    Bot = 'Bot',
    Bearer = 'Bearer',
}

export class Authorization {
    private _type: TokenTypes | string;
    private _token: string;
    private _cache: string;

    constructor(type: TokenTypes | string, token: string) {
        this._type = type;
        this._token = token;
        this._cache = '';
        this._update();
    }

    _update = () => this._cache = `${this._type} ${this._token}`;

    get type() { return this._type; };
    set type(value: TokenTypes | string) { this._type = value; this._update(); };

    get token() { return this._token; };
    set token(value: string) { this._token = value; this._update(); };

    toString = () => this._cache;
};

export type RequestOptions = {
    authorization?: Authorization;
    connectionTimeout?: number;
    rateLimit?: {
        retryTimeout?: number;
        retryCount?: number;
        callback?: (response: { message: string; retry_after: number; global: boolean; }, attempts: number) => {};
    };
};

export const Request = (method: string, endpoint: string, options?: RequestOptions, data?: object | string | null) => {
    let content: string;

    const requestOptions: https.RequestOptions = {
        method: method,
        timeout: options?.connectionTimeout ?? DEFAULT_CONNECTION_TIMEOUT,
        headers: {
            ...(data && (typeof data == 'string') ?
                { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(content = data) } :
                { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(content = JSON.stringify(data)) }
            ),
            ...(options?.authorization && { 'Authorization': options.authorization.toString() }),
        },
    };

    return new Promise<any>((resolve, reject) => {
        const
            URL = API_PATH + endpoint,
            retryTimeout = options?.rateLimit?.retryTimeout ?? DEFAULT_RETRY_TIMEOUT,
            retryCount = options?.rateLimit?.retryCount ?? DEFAULT_RETRY_COUNT;

        let attempts = 0;

        const RequestResult = (result: RequestResult) => {
            const code = result.code;
            if((code >= 200) && (code < 300)) {
                resolve(SafeJsonParse(result.data));
            } else if((code >= 400) && (code < 500)) {
                const response = SafeJsonParse(result.data);
                if(code == 429) {
                    attempts++;
                    options?.rateLimit?.callback?.(response, attempts);
                    if(attempts < retryCount)
                        setTimeout(TryRequest, Math.ceil(Number(response.retry_after) * 1000) ?? retryTimeout);
                    else
                        RequestError({ code, response });
                } else {
                    RequestError({ code, response });
                }
            } else {
                RequestError({ code });
            }
        };

        const RequestError = (error: RequestError) => reject(error);

        const TryRequest = () => HttpsRequest(URL, requestOptions, content).then(RequestResult).catch(RequestError);

        TryRequest();
    });
};

export type RequestResult = {
    code: number;
    data?: string;
};

export type RequestError = {
    code: number;
    response?: object;
};

const HttpsRequest = (url: string | URL, options: https.RequestOptions, data?: string | Buffer) => {
    return new Promise<RequestResult>((resolve, reject) => {
        const request = https.request(url, options, (response) => {
            if(response.statusCode == null)
                return reject('Unknown response.');

            const ReturnResult = (result?: string) => resolve({ code: response.statusCode ?? 0, data: result });

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
                    return ReturnResult(chunks[0].toString());

                return ReturnResult(Buffer.concat(chunks, totalLength).toString());
            });
        });

        request.on('error', reject);
        request.on('timeout', () => reject('Request timeout.'));

        request.end(data);
    });
};
