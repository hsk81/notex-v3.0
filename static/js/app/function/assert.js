define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AssertException = /** @class */ (function () {
        function AssertException(message) {
            this.message = message;
        }
        AssertException.prototype.toString = function () {
            return 'AssertException: ' + this.message;
        };
        return AssertException;
    }());
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