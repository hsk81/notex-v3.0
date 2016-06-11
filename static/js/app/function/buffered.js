function buffered(fn, ms) {
    if (ms === void 0) { ms = 200; }
    var id, gn = function () {
        var self = this, args = arguments;
        if (id !== undefined) {
            clearTimeout(id);
            id = undefined;
        }
        if (id === undefined) {
            id = setTimeout(function () {
                fn.apply(self, args);
                id = undefined;
            }, ms);
        }
    };
    gn.cancel = function () {
        if (id !== undefined) {
            clearTimeout(id);
            id = undefined;
        }
    };
    return gn;
}
//# sourceMappingURL=buffered.js.map