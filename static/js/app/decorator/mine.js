define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function mine(target, key, descriptor) {
        var fn = descriptor ? descriptor.value : target[key];
        var mn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
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