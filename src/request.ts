import { HttpsRequest, SafeJsonParse, Sleep } from './_common';
import { API_PATH } from './helpers';
import { Authorization } from './authorization';

const
    DEFAULT_CONNECTION_TIMEOUT = 5000,
    DEFAULT_RETRY_COUNT = 5;

const enum Headers {
    ContentType = 'Content-Type',
    ContentLength = 'Content-Length',
    Authorization = 'Authorization',
}

const enum ContentTypes {
    Form = 'application/x-www-form-urlencoded',
    Json = 'application/json',
}

export type RateLimitResponse = {
    message: string;
    retry_after: number;
    global: boolean;
};

export type RequestOptions = {
    authorization?: Authorization;
    connectionTimeout?: number;
    rateLimit?: {
        retryCount?: number;
        callback?: (response: RateLimitResponse, attempts: number) => void;
    };
};

let defOptions: RequestOptions = {};

// @internal
export const SetDefOptions = (options?: RequestOptions) =>
    defOptions = options ?? {};

// @internal
export const Request = async <T>(
    method: string,
    endpoint: string,
    {
        authorization,
        connectionTimeout: timeout = DEFAULT_CONNECTION_TIMEOUT,
        rateLimit: {
            retryCount = DEFAULT_RETRY_COUNT,
            callback: rateLimitCallback,
        } = {},
    } = defOptions,
    data?: object | string | null,
) => {
    const
        url = `${API_PATH}/${endpoint}`,
        headers: Record<string, string> = {},
        requestOptions = { method, headers, timeout };

    let content: string | undefined;

    if(typeof data == 'object') {
        content = JSON.stringify(data);
        headers[Headers.ContentType] = ContentTypes.Json;
    } else if(typeof data == 'string') {
        content = data;
        headers[Headers.ContentType] = ContentTypes.Form;
    }

    if(content)
        headers[Headers.ContentLength] = String(Buffer.byteLength(content));

    if(authorization instanceof Authorization)
        headers[Headers.Authorization] = String(authorization);

    let attempts = 0;

    while(true) {
        const { code, data } = await HttpsRequest(url, requestOptions, content);

        if((code >= 200) && (code < 300))
            return SafeJsonParse(data) as T;

        if((code >= 400) && (code < 500)) {
            if(code != 429) throw {
                code,
                response: SafeJsonParse(data),
            };

            const response = SafeJsonParse<RateLimitResponse>(data);
            if(!response) throw { code };

            attempts++;
            rateLimitCallback?.(response, attempts);

            const { retry_after } = response;
            if(!(retry_after && (attempts < retryCount)))
                throw { code, response };

            await Sleep(Math.ceil(Number(retry_after) * 1000));
            continue;
        }

        throw { code };
    }
};
