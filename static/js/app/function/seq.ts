export function seq(...fns: Function[]) {
    return function (this: any, ...args: any[]) {
        fns.forEach((fn: Function) => {
            fn.apply(this, args)
        });
    };
}

export default seq;
