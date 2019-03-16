define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mine(target, key, descriptor) {
        let fn = descriptor ? descriptor.value : target[key];
        let mn = function (...args) {
            return fn.apply(this, [this].concat(Array.prototype.slice.call(args)));
        };
        if (descriptor) {
            descriptor.value = mn;
        }
        else {
            target[key] = mn;
        }
    }
    exports.mine = mine;
    exports.default = mine;
});
//# sourceMappingURL=mine.js.map