define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function named(name) {
        return function (object) {
            if (object.prototype._named === undefined) {
                object.prototype._named = name;
            }
            if (object._named === undefined) {
                object._named = name;
            }
        };
    }
    exports.named = named;
    exports.default = named;
});
//# sourceMappingURL=named.js.map