console.debug('[import:app/function/partial.ts]');
Function.prototype.partial = function () {
    var args = (arguments.length > 0) ? arguments[0] : {}, negs = {}, func = this;
    var str = func.toString(), lhs = str.indexOf('(') + 1, rhs = str.indexOf(')'), names = str.slice(lhs, rhs).match(/([^\s,]+)/g);
    var i = 0;
    names.every(function (value) {
        if (value in args === false) {
            negs[i++] = value;
        }
        return true;
    });
    return function () {
        var union = [];
        for (var i_1 in arguments) {
            if (arguments.hasOwnProperty(i_1)) {
                args[negs[i_1]] = arguments[i_1];
            }
        }
        for (var j in names) {
            if (names.hasOwnProperty(j)) {
                union.push(args[names[j]]);
            }
        }
        return func.apply(this, union);
    };
};
//# sourceMappingURL=partial.js.map