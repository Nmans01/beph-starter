export const invariant = <T>(val: T, message: string) => {
    if (val === undefined) throw new Error(message);
    return val;
};