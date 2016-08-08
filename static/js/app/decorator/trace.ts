///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:app/decorator/trace.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import '../string/random';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function trace(
    flag:boolean, bef?:Function, aft?:Function):Function;
export function trace(
    ctor:Function):void;
export function trace(
    arg0:boolean|Function, arg1?:Function, arg2?:Function):Function|void
{
    if (typeof arg0 === 'boolean') {
        return _trace(<boolean>arg0, <Function>arg1, <Function>arg2);
    } else {
        _trace(true)(<Function>arg0);
    }
}

function _trace(flag:boolean, bef?:Function, aft?:Function):Function {
    return function (ctor:Function) {
        Object.keys(ctor.prototype).forEach((key:string) => {
            let dtor = Object.getOwnPropertyDescriptor(ctor.prototype, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag, bef, aft)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach((key:string) => {
            let dtor = Object.getOwnPropertyDescriptor(ctor, key);
            if (dtor && typeof dtor.value === 'function') {
                _traceable(flag, bef, aft)(ctor, key);
            }
        });
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function traceable(
    flag:boolean, bef?:Function, aft?:Function):Function;
export function traceable(
    target:any, key:string, dtor?:PropertyDescriptor):void;
export function traceable(
    arg0:boolean|any, arg1?:Function|string, arg2?:Function|PropertyDescriptor
):Function|void {
    if (typeof arg0 === 'boolean') {
        return _traceable(<boolean>arg0, <Function>arg1, <Function>arg2);
    } else {
        _traceable(true)(<any>arg0, <string>arg1, <PropertyDescriptor>arg2);
    }
}

function _traceable(
    flag:boolean, bef?:Function, aft?:Function
):Function {
    return function (target:any, key:string, dtor?:PropertyDescriptor) {
        let wrap = (fn:Function, callback:Function) => {
            if (!flag) {
                (<any>fn)['_traced'] = false;
            } else {
                if ((<any>fn)['_traced'] === undefined) {
                    (<any>fn)['_traced'] = true;

                    let tn:Function = function (...args:any[]) {
                        let _named = target._named || '@',
                            random = String.random(4, 16),
                            dt_beg = new Date().toISOString();

                        if (bef) bef(args); else setTimeout(() => {
                            console.log(
                                `[${dt_beg}]#${random} >>> ${_named}.${key}`);
                            console.log(
                                `[${dt_beg}]#${random}`, args);
                        }, 0);

                        let result = fn.apply(this, args),
                            dt_end = new Date().toISOString();

                        if (aft) aft(result, args); else setTimeout(() => {
                            console.log(
                                `[${dt_end}]#${random} <<< ${_named}.${key}`);
                            console.log(
                                `[${dt_end}]#${random}`, result);
                        }, 0);

                        return result;
                    };
                    for (let el in fn) {
                        if (fn.hasOwnProperty(el)) {
                            (<any>tn)[el] = (<any>fn)[el];
                        }
                    }
                    callback(tn);
                }
            }
        };
        if (dtor) {
            if (typeof dtor.value === 'function') {
                wrap(dtor.value, (tn:Function) => {
                    dtor.value = tn;
                });
            } else {
                if (typeof dtor.get === 'function') {
                    wrap(dtor.get, (tn:Function) => {
                        dtor.get = <any>tn;
                    });
                }
                if (typeof dtor.set === 'function') {
                    wrap(dtor.set, (tn:Function) => {
                        dtor.set = <any>tn;
                    });
                }
            }
        } else {
            wrap(target[key], (tn:Function) => {
                target[key] = tn;
            });
        }
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default trace;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
