function mine(fn:Function) {
    return function () {
        return fn.apply(this, [this].concat(Array.prototype.slice.call(
            arguments
        )));
    };
}
