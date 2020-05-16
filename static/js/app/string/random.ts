interface StringConstructor {
    random(length?: number, range?: number): string;
}
String.random = function (
    length: number = 0, range: number = 36
): string {
    length = Math.floor(length);
    range = Math.floor(range);
    const p_0 = Math.pow(range, length);
    const p_1 = range * p_0;
    return (length > 0)
        ? Math.floor(p_1 - p_0 * Math.random()).toString(range).slice(1)
        : '';
};
