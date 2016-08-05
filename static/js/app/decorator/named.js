define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/decorator/named.ts]');
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = named;
});
//# sourceMappingURL=named.js.map