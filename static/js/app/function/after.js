function after(fn, callback) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        callback.apply(this, [fn.apply(this, args)].concat(args));
    };
}
//# sourceMappingURL=after.js.map