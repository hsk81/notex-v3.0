function buffered (fn, ms) {
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
            }, ms || 200);
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