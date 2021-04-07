export const SafeJsonParse = (data?: string) => {
    if(data != null)
        try {
            return JSON.parse(data);
        } catch {}
    return null;
};

export const Sleep = (time: number) =>
    new Promise<undefined>((resolve) => setTimeout(resolve, time));
