String.random = function (length, range) {
    if (length === void 0) { length = 0; }
    if (range === void 0) { range = 36; }
    length = Math.floor(length);
    range = Math.floor(range);
    var p_0 = Math.pow(range, length), p_1 = range * p_0;
    return (length > 0) ?
        Math.floor(p_1 - p_0 * Math.random()).toString(range).slice(1) : '';
};
//# sourceMappingURL=random.js.map