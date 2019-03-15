export function before(fn: Function, callback: Function) {
    return function (this: any) {
        let args = Array.prototype.slice.call(arguments);
        if (callback.apply(this, [fn.bind(this)].concat(args)) !== false) {
            return fn.apply(this, args);
        }
    };
}

export default before;
