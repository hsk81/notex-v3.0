///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:app/decorator/trace.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import '../string/random';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function trace(
    flag:boolean):Function;
export function trace(
    ctor:Function):void;
export function trace(
    arg:boolean|Function):Function|void
{
    if (typeof arg === 'boolean') {
        return _trace(arg);
    } else {
        _trace(true)(<Function>arg);
    }
}

function _trace(flag:boolean):Function {
    return function (ctor:Function) {
        Object.keys(ctor.prototype).forEach((key:string) => {
            let fn:any = ctor.prototype[key];
            if (typeof fn === 'function') {
                _traceable(flag)(ctor.prototype, key);
            }
        });
        Object.keys(ctor).forEach((key:string) => {
            let fn:any = (<any>ctor)[key];
            if (typeof fn === 'function') {
                _traceable(flag)(ctor, key);
            }
        });
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export function traceable(
    flag:boolean):Function;
export function traceable(
    target:any, key:string, descriptor?:PropertyDescriptor):void;
export function traceable(
    arg:boolean|any, key?:string, descriptor?:PropertyDescriptor
):Function|void {
    if (typeof arg === 'boolean') {
        return _traceable(arg);
    } else {
        _traceable(true)(<any>arg, key, descriptor);
    }
}

function _traceable(flag:boolean):Function {
    return function (target:any, key:string, descriptor?:PropertyDescriptor) {
        let fn:Function = descriptor ? descriptor.value : target[key];
        if (!flag) {
            (<any>fn)['_traced'] = false;
        } else {
            if ((<any>fn)['_traced'] === undefined) {
                (<any>fn)['_traced'] = true;

                let tn:Function = function () {
                    let _named = target._named || '@',
                        random = String.random(4, 16),
                        dt_beg = new Date().toISOString();

                    console.log(
                        `[${dt_beg}]#${random} >>> ${_named}.${key}`);
                    console.log(
                        `[${dt_beg}]#${random}`, arguments);

                    let result = fn.apply(this, arguments),
                        dt_end = new Date().toISOString();

                    console.log(
                        `[${dt_end}]#${random} <<< ${_named}.${key}`);
                    console.log(
                        `[${dt_end}]#${random}`, result);

                    return result;
                };
                for (let el in fn) {
                    if (fn.hasOwnProperty(el)) {
                        (<any>tn)[el] = (<any>fn)[el];
                    }
                }
                if (descriptor) {
                    descriptor.value = tn;
                } else {
                    target[key] = tn;
                }
            }
        }
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default trace;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
