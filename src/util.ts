// @internal
export const SafeJsonParse = (data?: string) => {
    if(data != null)
        try {
            return JSON.parse(data);
        } catch {}
    return null;
};

// @internal
export const Sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));
