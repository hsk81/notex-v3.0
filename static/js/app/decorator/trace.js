"use strict";
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
console.debug('[import:app/decorator/trace.ts]');
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
require("../string/random");
function trace(arg0, arg1, arg2) {
    if (typeof arg0 === 'boolean') {
        return _trace(arg0, arg1, arg2);
    }
    else {
        _trace(true)(arg0);
    }
}
exports.trace = trace;
function _trace(flag, bef, aft) {
    return function (ctor) {
        Object.keys(ctor.prototype).forEach(function (key) {
            var dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag, bef, aft)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach(function (key) {
            var dtor = Object.getOwnPropertyDescriptor(ctor, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag, bef, aft)(ctor, key);
            }
        });
    };
}
function traceable(arg0, arg1, arg2) {
    if (typeof arg0 === 'boolean') {
        return _traceable(arg0, arg1, arg2);
    }
    else {
        _traceable(true)(arg0, arg1, arg2);
    }
}
exports.traceable = traceable;
function _traceable(flag, bef, aft) {
    return function (target, key, dtor) {
        var wrap = function (fn, callback) {
            if (!flag) {
                fn['_traced'] = false;
            }
            else {
                if (fn['_traced'] === undefined) {
                    fn['_traced'] = true;
                    var tn = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var _named = target._named || '@', random = String.random(4, 16), dt_beg = new Date().toISOString();
                        if (bef)
                            bef({
                                name: _named, nonce: random, timestamp: dt_beg
                            }, args);
                        else
                            setTimeout(function () {
                                console.log("[" + dt_beg + "]#" + random + " >>> " + _named + "." + key);
                                console.log("[" + dt_beg + "]#" + random, args);
                            }, 0);
                        var result = fn.apply(this, args), dt_end = new Date().toISOString();
                        if (aft)
                            aft({
                                name: _named, nonce: random, timestamp: dt_end
                            }, result, args);
                        else
                            setTimeout(function () {
                                console.log("[" + dt_end + "]#" + random + " <<< " + _named + "." + key);
                                console.log("[" + dt_end + "]#" + random, result);
                            }, 0);
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
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
exports.default = trace;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
