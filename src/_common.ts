import { RequestOptions, request } from 'https';

// @internal
export const SafeJsonParse = <T>(data?: string) =>
    data ? JSON.parse(data) as T : null;

// @internal
export const Sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

// @internal
export const TimestampString = (timestamp: number) => {
    const str = new Date(timestamp).toISOString();
    return `${str.slice(0, 10)} ${str.slice(11, -5)} UTC`;
};

// @internal
export const HttpsRequest = (
    url: string,
    options: RequestOptions,
    content?: string | Buffer,
) => new Promise<{
    code: number;
    data?: string;
}>((resolve, reject) => {
    const req = request(url, options, (response) => {
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

    req.on('error', reject);
    req.on('timeout', () => reject('Request timeout.'));

    req.end(content);
});
