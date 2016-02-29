function mine (fn) {
    return function () {
        return fn.apply(this, [this].concat(Array.prototype.slice.call(
            arguments
        )));
    };
}

function before (fn, callback) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
            return fn.apply(this, args);
        }
    };
}

function after (fn, callback) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        callback.apply(this, [fn.apply(this, args)].concat(args));
    };
}
