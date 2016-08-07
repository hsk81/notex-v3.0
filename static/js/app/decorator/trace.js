define(["require", "exports", '../string/random'], function (require, exports) {
    "use strict";
    console.debug('[import:app/decorator/trace.ts]');
    function trace(arg) {
        if (typeof arg === 'boolean') {
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
                if (dtor && typeof dtor.value === 'function') {
                    _traceable(flag)(ctor.prototype, key);
                }
            });
            Object.keys(ctor).forEach(function (key) {
                var dtor = Object.getOwnPropertyDescriptor(ctor, key);
                if (dtor && typeof dtor.value === 'function') {
                    _traceable(flag)(ctor, key);
                }
            });
        };
    }
    function traceable(arg, key, dtor) {
        if (typeof arg === 'boolean') {
            return _traceable(arg);
        }
        else {
            _traceable(true)(arg, key, dtor);
        }
    }
    exports.traceable = traceable;
    function _traceable(flag) {
        return function (target, key, dtor) {
            var wrap = function (fn, callback) {
                if (!flag) {
                    fn['_traced'] = false;
                }
                else {
                    if (fn['_traced'] === undefined) {
                        fn['_traced'] = true;
                        var tn = function () {
                            var _named = target._named || '@', random = String.random(4, 16), dt_beg = new Date().toISOString();
                            console.log("[" + dt_beg + "]#" + random + " >>> " + _named + "." + key);
                            console.log("[" + dt_beg + "]#" + random, arguments);
                            var result = fn.apply(this, arguments), dt_end = new Date().toISOString();
                            console.log("[" + dt_end + "]#" + random + " <<< " + _named + "." + key);
                            console.log("[" + dt_end + "]#" + random, result);
                            return result;
                        };
                        for (var el in fn) {
                            if (fn.hasOwnProperty(el)) {
                                tn[el] = fn[el];
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = trace;
});
//# sourceMappingURL=trace.js.map