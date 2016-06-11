function after(fn:Function, callback:Function):Function {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        callback.apply(this, [fn.apply(this, args)].concat(args));
    };
}
