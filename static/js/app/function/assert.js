define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AssertException {
        constructor(message) {
            this.message = message;
        }
        toString() {
            return 'AssertException: ' + this.message;
        }
    }
    exports.AssertException = AssertException;
    function assert(expression, message) {
        if (!expression) {
            throw new AssertException(message);
        }
        return expression;
    }
    exports.assert = assert;
    exports.default = assert;
});
//# sourceMappingURL=assert.js.map