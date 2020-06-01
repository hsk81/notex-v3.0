export function after(fn: Function, callback: Function) {
    return function (this: any) {
        const args = Array.prototype.slice.call(arguments);
        callback.apply(this, [fn.apply(this, args)].concat(args));
    };
}
export default after;
