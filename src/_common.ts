// @internal
export const SafeJsonParse = (data?: string) => {
    if(!data) return null;
    try {
        return JSON.parse(data);
    } catch {}
};

// @internal
export const Sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
