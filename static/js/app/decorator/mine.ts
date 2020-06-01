export function mine(
    target: any, key: string, descriptor?: PropertyDescriptor
) {
    const fn: Function = descriptor ? descriptor.value : target[key];
    const mn: Function = function (this: any, ...args: any[]) {
        return fn.apply(this, [this].concat(
            Array.prototype.slice.call(args)
        ));
    };
    if (descriptor) {
        descriptor.value = mn;
    } else {
        target[key] = mn;
    }
}
export default mine;
