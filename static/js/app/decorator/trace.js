///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.debug('[import:app/decorator/trace.ts]');
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
            Object.keys(ctor.prototype).forEach(function (key) {
                var dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
                if (dtor && typeof dtor.value === "function") {
                    _traceable(flag)(ctor.prototype, key);
                }
            });
            Object.keys(ctor).forEach(function (key) {
                var dtor = Object.getOwnPropertyDescriptor(ctor, key);
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
            var wrap = function (fn, callback) {
                var gn = fn;
                if (!flag) {
                    gn._traced = false;
                }
                else {
                    if (gn._traced === undefined) {
                        gn._traced = true;
                        var tn = function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var name = target.constructor &&
                                target.constructor.name || "@";
                            setTimeout(function () {
                                console.group(name + "." + key);
                                if (args.length > 0) {
                                    console.debug.apply(console, args);
                                }
                                if (result !== undefined) {
                                    console.debug(result);
                                }
                            }, 0);
                            var result = gn.apply(this, args);
                            setTimeout(function () {
                                console.groupEnd();
                            }, 0);
                            return result;
                        };
                        for (var el in gn) {
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
                    wrap(dtor.value, function (tn) {
                        dtor.value = tn;
                    });
                }
                else {
                    if (typeof dtor.get === 'function') {
                        wrap(dtor.get, function (tn) {
                            dtor.get = tn;
                        });
                    }
                    if (typeof dtor.set === 'function') {
                        wrap(dtor.set, function (tn) {
                            dtor.set = tn;
                        });
                    }
                }
            }
            else {
                wrap(target[key], function (tn) {
                    target[key] = tn;
                });
            }
        };
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    exports.default = trace;
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//# sourceMappingURL=trace.js.map