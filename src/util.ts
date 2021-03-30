export const SafeJsonParse = (data?: string) => {
    if(data != null) try { return JSON.parse(data); } catch { }
    return null;
};

export const SafePromise = (promise: Promise<any>) => new Promise<any>(resolve => promise.then(result => resolve(result)).catch(() => resolve(null)));

export const Sleep = (time: number) => new Promise<null>((resolve) => setTimeout(resolve, time));
