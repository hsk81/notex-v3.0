import { _traceable } from "./traceable";
export { traceable } from "./traceable";

export function trace(
    flag: boolean): Function;
export function trace(
    ctor: Function): void;
export function trace(
    arg: boolean|Function): Function|void {
    if (typeof arg === "boolean") {
        return _trace(arg);
    } else {
        _trace(true)(arg as Function);
    }
}
export function _trace(flag: boolean): Function {
    return function (ctor: Function) {
        Object.getOwnPropertyNames(ctor.prototype).forEach((name: string) => {
            const dtor = Object.getOwnPropertyDescriptor(
                ctor.prototype, name
            );
            if (dtor && typeof dtor.value === "function") {
                _traceable(flag, ctor.name)(ctor.prototype, name);
            }
        });
        Object.getOwnPropertyNames(ctor).forEach((name: string) => {
            const dtor = Object.getOwnPropertyDescriptor(
                ctor, name
            );
            if (dtor && typeof dtor.value === "function") {
                _traceable(flag, ctor.name)(ctor, name);
            }
        });
    };
}
export default trace;
