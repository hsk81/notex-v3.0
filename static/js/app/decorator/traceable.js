/* tslint:disable:ban-types */
/* tslint:disable:no-string-literal */
/* tslint:disable:only-arrow-functions */
/* tslint:disable:trailing-comma */
/* tslint:disable:variable-name */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function traceable(arg, key, dtor) {
        if (typeof arg === "boolean") {
            return _traceable(arg);
        }
        else {
            _traceable(true)(arg, key, dtor);
        }
    }
    exports.traceable = traceable;
    const trace = window.TRACE || JSON.parse(localStorage.getItem('TRACE'));
    function _traceable(flag, name) {
        return function (target, key, dtor) {
            const wrap = (fn, callback) => {
                const gn = fn;
                if (!flag) {
                    gn.__traced__ = null;
                }
                else {
                    if (gn.__traced__ === undefined) {
                        if (name !== undefined) {
                            gn.__traced__ = name;
                        }
                        else {
                            if (target.constructor &&
                                target.constructor.name !== undefined) {
                                gn.__traced__ = target.constructor.name;
                            }
                            else if (target.name !== undefined) {
                                gn.__traced__ = target.name;
                            }
                            else {
                                gn.__traced__ = "@";
                            }
                        }
                        const tn = function (...args) {
                            if (trace || window.TRACE) {
                                if (args.length > 0) {
                                    console.group(`${gn.__traced__}.${key}`, args);
                                }
                                else {
                                    console.group(`${gn.__traced__}.${key}`);
                                }
                                const t0 = new Date();
                                const result = gn.apply(this, args);
                                const dt = new Date() - t0;
                                if (result !== undefined) {
                                    console.info(result);
                                }
                                console.debug(`${dt}ms`);
                                console.groupEnd();
                                return result;
                            }
                            else {
                                return gn.apply(this, args);
                            }
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
                if (typeof dtor.value === "function") {
                    wrap(dtor.value, (tn) => {
                        dtor.value = tn;
                    });
                }
                else {
                    if (typeof dtor.get === "function") {
                        wrap(dtor.get, (tn) => {
                            dtor.get = tn;
                        });
                    }
                    if (typeof dtor.set === "function") {
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
    exports._traceable = _traceable;
    exports.default = traceable;
});
//# sourceMappingURL=traceable.js.map