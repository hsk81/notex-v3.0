String.random = function (length, range) {

    length = typeof length === 'number' && length > 0 && Math.floor(length) || 0;
    range = typeof range === 'number' && range > 1 && Math.floor(range) || 36;
    var p_0 = Math.pow(range, length), p_1 = range * p_0;

    return typeof length === 'number' && length > 0 ?
        Math.floor(p_1 - p_0 * Math.random()).toString(range).slice(1) : '';
};