define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function after(fn, callback) {
        return function () {
            let args = Array.prototype.slice.call(arguments);
            callback.apply(this, [fn.apply(this, args)].concat(args));
        };
    }
    exports.after = after;
    exports.default = after;
});
//# sourceMappingURL=after.js.map