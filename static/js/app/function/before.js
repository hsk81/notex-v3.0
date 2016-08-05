define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/function/before.ts]');
    function before(fn, callback) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
                return fn.apply(this, args);
            }
        };
    }
    exports.before = before;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = before;
});
//# sourceMappingURL=before.js.map