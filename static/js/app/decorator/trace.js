define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            Object.keys(ctor.prototype).forEach((key) => {
                const dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
                if (dtor && typeof dtor.value === "function") {
                    _traceable(flag)(ctor.prototype, key);
                }
            });
            Object.keys(ctor).forEach((key) => {
                const dtor = Object.getOwnPropertyDescriptor(ctor, key);
                if (dtor && typeof dtor.value === "function") {
                    _traceable(flag)(ctor, key);
                }
            });
        };
    }
    function traceable(arg0, arg1, arg2) {
        if (typeof arg0 === 'boolean') {
            return _traceable(arg0);
        }
        else {
            _traceable(true)(arg0, arg1, arg2);
        }
    }
    exports.traceable = traceable;
    function _traceable(flag) {
        return function (target, key, dtor) {
            const wrap = (fn, callback) => {
                const gn = fn;
                if (!flag) {
                    gn._traced = false;
                }
                else {
                    if (gn._traced === undefined) {
                        gn._traced = true;
                        const tn = function (...args) {
                            const name = target._named ||
                                target.constructor &&
                                    target.constructor.name || "@";
                            setTimeout(() => {
                                console.group(`${name}.${key}`);
                                if (args.length > 0) {
                                    console.debug(...args);
                                }
                                if (result !== undefined) {
                                    console.debug(result);
                                }
                            }, 0);
                            const result = gn.apply(this, args);
                            setTimeout(() => {
                                console.groupEnd();
                            }, 0);
                            return result;
                        };
                        for (const el in gn) {
                            if (gn.hasOwnProperty(el)) {
                                tn[el] = gn[el];
                            }
                        }
                        callback(tn);
                    }
                }
            };
            if (dtor) {
                if (typeof dtor.value === 'function') {
                    wrap(dtor.value, (tn) => {
                        dtor.value = tn;
                    });
                }
                else {
                    if (typeof dtor.get === 'function') {
                        wrap(dtor.get, (tn) => {
                            dtor.get = tn;
                        });
                    }
                    if (typeof dtor.set === 'function') {
                        wrap(dtor.set, (tn) => {
                            dtor.set = tn;
                        });
                    }
                }
            }
            else {
                wrap(target[key], (tn) => {
                    target[key] = tn;
                });
            }
        };
    }
    exports.default = trace;
});
//# sourceMappingURL=trace.js.map