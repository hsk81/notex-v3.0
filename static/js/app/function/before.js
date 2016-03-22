function before (fn, callback) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
            return fn.apply(this, args);
        }
    };
}
