/* tslint:disable:ban-types */
/* tslint:disable:no-string-literal */
/* tslint:disable:only-arrow-functions */
/* tslint:disable:trailing-comma */
/* tslint:disable:variable-name */

export function traceable(
    flag: boolean): Function;
export function traceable(
    target: any, key: string, dtor?: PropertyDescriptor): void;
export function traceable(
    arg: boolean | any, key?: string, dtor?: PropertyDescriptor,
): Function | void {
    if (typeof arg === "boolean") {
        return _traceable(arg);
    } else {
        _traceable(true)(arg as any, key, dtor);
    }
}

interface ITracedFunction extends Function {
    __traced__?: string | null;
}
const trace = window.TRACE || JSON.parse(
    localStorage.getItem('TRACE') as string
);

export function _traceable(
    flag: boolean, name?: string
): Function {
    return function(
        target: any, key: string, dtor?: PropertyDescriptor,
    ) {
        const wrap = (
            fn: Function, callback: Function,
        ) => {
            const gn = fn as ITracedFunction;
            if (!flag) {
                gn.__traced__ = null;
            } else {
                if (gn.__traced__ === undefined) {
                    if (name !== undefined) {
                        gn.__traced__ = name;
                    } else {
                        if (target.constructor &&
                            target.constructor.name !== undefined
                        ) {
                            gn.__traced__ = target.constructor.name;
                        } else if (target.name !== undefined) {
                            gn.__traced__ = target.name;
                        } else {
                            gn.__traced__ = "@";
                        }
                    }
                    const tn: Function = function(
                        this: any, ...args: any[]
                    ) {
                        if (trace || window.TRACE) {
                            if (args.length > 0) {
                                console.group(`${gn.__traced__}.${key}`, args);
                            } else {
                                console.group(`${gn.__traced__}.${key}`);
                            }
                            const t0 = new Date() as any;
                            const result = gn.apply(this, args);
                            const dt = new Date() as any - t0;
                            if (result !== undefined) {
                                console.info(result);
                            }
                            console.debug(`${dt}ms`);
                            console.groupEnd();
                            return result;
                        } else {
                            return gn.apply(this, args);
                        }
                    };
                    for (const el in gn) {
                        if (gn.hasOwnProperty(el)) {
                            (tn as any)[el] = (gn as any)[el];
                        }
                    }
                    callback(tn);
                }
            }
        };
        if (dtor) {
            if (typeof dtor.value === "function") {
                wrap(dtor.value, (tn: Function) => {
                    dtor.value = tn;
                });
            } else {
                if (typeof dtor.get === "function") {
                    wrap(dtor.get, (tn: Function) => {
                        dtor.get = tn as any;
                    });
                }
                if (typeof dtor.set === "function") {
                    wrap(dtor.set, (tn: Function) => {
                        dtor.set = tn as any;
                    });
                }
            }
        } else {
            wrap(target[key], (tn: Function) => {
                target[key] = tn;
            });
        }
    };
}

export default traceable;
