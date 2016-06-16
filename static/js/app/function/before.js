define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:before.ts]');
    function before(fn, callback) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
                return fn.apply(this, args);
            }
        };
    }
    exports.before = before;
    exports.__esModule = true;
    exports["default"] = before;
});
//# sourceMappingURL=before.js.map