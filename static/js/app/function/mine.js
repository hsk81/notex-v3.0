function mine(fn) {
    return function () {
        return fn.apply(this, [this].concat(Array.prototype.slice.call(arguments)));
    };
}
//# sourceMappingURL=mine.js.map