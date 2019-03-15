export function seq(...fns: Function[]) {
    return function (...args: any[]) {
        fns.forEach((fn: Function) => {
            fn.apply(this, args)
        });
    };
}

export default seq;
