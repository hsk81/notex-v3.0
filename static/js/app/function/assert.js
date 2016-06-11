var AssertException = (function () {
    function AssertException(message) {
        this.message = message;
    }
    AssertException.prototype.toString = function () {
        return 'AssertException: ' + this.message;
    };
    return AssertException;
}());
function assert(expression, message) {
    if (!expression) {
        throw new AssertException(message);
    }
    return expression;
}
//# sourceMappingURL=assert.js.map