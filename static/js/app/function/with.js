console.debug('[import:with.ts]');
Function.prototype.with = function () {
    var slice = Array.prototype.slice, args = slice.call(arguments), func = this;
    return function () {
        return func.apply(this, args.concat(slice.call(arguments)));
    };
};
//# sourceMappingURL=with.js.map