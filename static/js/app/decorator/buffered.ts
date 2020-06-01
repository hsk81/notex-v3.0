export function buffered(
    ms: number,
): MethodDecorator;
export function buffered(
    tgt: any, key: string|symbol, tpd?: PropertyDescriptor
): PropertyDescriptor|void;
export function buffered(
    arg: number|any, key?: string|symbol, tpd?: PropertyDescriptor
) {
    if (typeof arg === "number") {
        return _buffered(arg);
    } else {
        return _buffered()(
            arg as any,
            key as string|symbol,
            tpd as PropertyDescriptor
        );
    }
}
function _buffered(ms?: number): MethodDecorator {
    return (
        tgt: any, key: string|symbol, tpd?: PropertyDescriptor,
    ): PropertyDescriptor|void => {
        if (tpd) {
            tpd.value = buffer(tpd.value, ms);
            return tpd;
        } else {
            tgt[key] = buffer(tgt[key], ms);
        }
    };
}
export interface BufferedFunction {
    (this: any, ...args: any[]): Promise<any>;
}
export interface BufferedFunction {
    cancel: () => void;
}
export function buffer(
    fn: Function, ms: number = 200
): BufferedFunction {
    let id: any;
    const bn = function(
        this: any, ...args: any[]
    ): Promise<any> {
        return new Promise((resolve) => {
            clearTimeout(id); id = setTimeout(
                () => resolve(fn.apply(this, args)), ms,
            );
        });
    };
    (bn as BufferedFunction).cancel = () => {
        clearTimeout(id);
    };
    return bn as BufferedFunction;
}
export default buffered;
