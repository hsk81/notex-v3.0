define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function before(fn, callback) {
        return function () {
            let args = Array.prototype.slice.call(arguments);
            if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
                return fn.apply(this, args);
            }
        };
    }
    exports.before = before;
    exports.default = before;
});
//# sourceMappingURL=before.js.map