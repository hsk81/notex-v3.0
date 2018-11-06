///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:app/decorator/buffered.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface IBufferedFunction extends Function {
    cancel:Function;
}

///////////////////////////////////////////////////////////////////////////////

export function buffered(
    ms:number):Function;
export function buffered(
    target:any, key:string, descriptor?:PropertyDescriptor):void;
export function buffered(
    arg:number|any, key?:string, descriptor?:PropertyDescriptor
):Function|void {
    if (typeof arg === 'number') {
        return _buffered(arg);
    } else {
        _buffered(200)(<any>arg, key, descriptor);
    }
}

function _buffered(ms:number) {
    return function (
        target:any, key:string, descriptor?:PropertyDescriptor
    ) {
        let fn:Function = descriptor ? descriptor.value : target[key],
            id:number;
        let bn:Function = function (...args:any[]) {
            if (id !== undefined) {
                clearTimeout(id);
                id = undefined;
            }
            if (id === undefined) {
                id = setTimeout(() => {
                    fn.apply(this, args);
                    id = undefined;
                }, ms) as any;
            }
        };
        for (let el in fn) {
            if (fn.hasOwnProperty(el)) {
                (<any>bn)[el] = (<any>fn)[el];
            }
        }
        (<IBufferedFunction>bn).cancel = function () {
            if (id !== undefined) {
                clearTimeout(id);
                id = undefined;
            }
        };
        if (descriptor) {
            descriptor.value = bn;
        } else {
            target[key] = bn;
        }
    };
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export default buffered;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
