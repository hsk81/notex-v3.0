define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function seq(...fns) {
        return function (...args) {
            fns.forEach((fn) => {
                fn.apply(this, args);
            });
        };
    }
    exports.seq = seq;
    exports.default = seq;
});
//# sourceMappingURL=seq.js.map