define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/function/assert.ts]');
    var AssertException = (function () {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = assert;
});
//# sourceMappingURL=assert.js.map