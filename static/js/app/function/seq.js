define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/function/seq.ts]');
    function seq() {
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i - 0] = arguments[_i];
        }
        return function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            fns.forEach(function (fn) {
                fn.apply(_this, args);
            });
        };
    }
    exports.seq = seq;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = seq;
});
//# sourceMappingURL=seq.js.map