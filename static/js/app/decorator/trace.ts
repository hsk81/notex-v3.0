export function trace(
    flag: boolean): Function;
export function trace(
    ctor: Function): void;
export function trace(
    arg: boolean | Function): Function | void {
    if (typeof arg === "boolean") {
        return _trace(arg);
    } else {
        _trace(true)(arg as Function);
    }
}

function _trace(flag: boolean): Function {
    return function (ctor: Function) {
        Object.keys(ctor.prototype).forEach((key: string) => {
            const dtor = Object.getOwnPropertyDescriptor(
                ctor.prototype, key,
            );
            if (dtor && typeof dtor.value === "function") {
                _traceable(flag)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach((key: string) => {
            const dtor = Object.getOwnPropertyDescriptor(
                ctor, key,
            );
            if (dtor && typeof dtor.value === "function") {
                _traceable(flag)(ctor, key);
            }
        });
    };
}

interface ITracedFunction extends Function {
    _traced: Boolean;
}

export function traceable(
    flag: boolean, bef?: Function, aft?: Function): Function;
export function traceable(
    target: any, key: string, dtor?: PropertyDescriptor): void;
export function traceable(
    arg0: boolean | any, arg1?: Function | string, arg2?: Function | PropertyDescriptor
): Function | void {
    if (typeof arg0 === 'boolean') {
        return _traceable(<boolean>arg0);
    } else {
        _traceable(true)(<any>arg0, <string>arg1, <PropertyDescriptor>arg2);
    }
}

function _traceable(
    flag: boolean
): Function {
    return function (target: any, key: string, dtor?: PropertyDescriptor) {
        const wrap = (
            fn: Function, callback: Function
        ) => {
            const gn = fn as ITracedFunction;
            if (!flag) {
                gn._traced = false;
            } else {
                if (gn._traced === undefined) {
                    gn._traced = true;

                    const tn: Function = function (
                        this: any, ...args: any[]
                    ) {
                        const name =
                            target._named ||
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
                            (tn as any)[el] = (gn as any)[el];
                        }
                    }
                    callback(tn);
                }
            }
        };
        if (dtor) {
            if (typeof dtor.value === 'function') {
                wrap(dtor.value, (tn: Function) => {
                    dtor.value = tn;
                });
            } else {
                if (typeof dtor.get === 'function') {
                    wrap(dtor.get, (tn: Function) => {
                        dtor.get = <any>tn;
                    });
                }
                if (typeof dtor.set === 'function') {
                    wrap(dtor.set, (tn: Function) => {
                        dtor.set = <any>tn;
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

export default trace;
