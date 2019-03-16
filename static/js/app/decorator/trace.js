/* tslint:disable:ban-types */
/* tslint:disable:only-arrow-functions */
/* tslint:disable:space-before-function-paren */
/* tslint:disable:trailing-comma */
define(["require", "exports", "./traceable", "./traceable"], function (require, exports, traceable_1, traceable_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.traceable = traceable_2.traceable;
    function trace(arg) {
        if (typeof arg === "boolean") {
            return _trace(arg);
        }
        else {
            _trace(true)(arg);
        }
    }
    exports.trace = trace;
    function _trace(flag) {
        return function (ctor) {
            Object.getOwnPropertyNames(ctor.prototype).forEach((name) => {
                const dtor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
                if (dtor && typeof dtor.value === "function") {
                    traceable_1._traceable(flag, ctor.name)(ctor.prototype, name);
                }
            });
            Object.getOwnPropertyNames(ctor).forEach((name) => {
                const dtor = Object.getOwnPropertyDescriptor(ctor, name);
                if (dtor && typeof dtor.value === "function") {
                    traceable_1._traceable(flag, ctor.name)(ctor, name);
                }
            });
        };
    }
    exports._trace = _trace;
    exports.default = trace;
});
//# sourceMappingURL=trace.js.map