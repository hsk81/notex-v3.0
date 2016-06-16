define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:mine.ts]');
    function mine(fn) {
        return function () {
            return fn.apply(this, [this].concat(Array.prototype.slice.call(arguments)));
        };
    }
    exports.mine = mine;
    exports.__esModule = true;
    exports["default"] = mine;
});
//# sourceMappingURL=mine.js.map