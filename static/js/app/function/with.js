/**
 * Allows to bind any *consecutive and initial* arguments, e.g. from a function
 *
 *   fn (arg{0}, arg{1}, .., arg{n-3}, arg{n-2}, arg{n-1})
 *
 * we can create a new function `gn` which requires only the last two arguments,
 * by applying the
 *
 *   gn = fn.curry (val{0}, val{1}, .., val{n-3})
 *
 * curry operation, where `gn` would be invoked like `gn (val{n-2}, val{n-1})`.
 */

Function.prototype.with = function () {
    var slice = Array.prototype.slice,
        args = slice.call(arguments),
        func = this;

    return function () {
        return func.apply(this, args.concat(slice.call(arguments)));
    };
};
