/**
 * Allows to bind *any* argument using their names rather their positions; this
 * approach is more flexible if the initial arguments are to be left unbound.
 * E.g. from a function
 *
 *   fn (arg{0}, arg{1}, .., arg{n-3}, arg{n-2}, arg{n-1})
 *
 * we can create a new function `gn` which requires all arguments but the last
 * and the *third last* parameter by applying the
 *
 *   gn = fn.partial ({arg{n-3}:val{n-3}, arg{n-1}:val{n-1}})
 *
 * partial operation. The invocation of `gn` would be like `gn (val{0}, val{1},
 * .., val{n-2})`. Notice that the relative position of the *unbound* arguments
 * is left intact.
 */

Function.prototype.partial = function () {
    var args = (arguments.length > 0) ? arguments[0] : {},
        negs = {},
        func = this;

    var str = func.toString(),
        lhs = str.indexOf('(') + 1,
        rhs = str.indexOf(')'),
        names = str.slice(lhs, rhs).match(/([^\s,]+)/g);

    var i = 0; names.every(function (value) {
        if (value in args === false) negs[i++] = value; return true;
    });

    return function () {
        var union = [];
        for (var i in arguments)
            if (arguments.hasOwnProperty(i)) args[negs[i]] = arguments[i];
        for (var j in names)
            if (names.hasOwnProperty(j)) union.push(args[names[j]]);
        return func.apply(this, union);
    };
};
