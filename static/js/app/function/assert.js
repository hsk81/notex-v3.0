define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function assert(expression, message) {
        if (!expression) {
            throw new Error(message);
        }
        return expression;
    }
    exports.assert = assert;
    exports.default = assert;
});
//# sourceMappingURL=assert.js.map