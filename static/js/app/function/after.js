define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:after.ts]');
    function after(fn, callback) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            callback.apply(this, [fn.apply(this, args)].concat(args));
        };
    }
    exports.after = after;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = after;
});
//# sourceMappingURL=after.js.map