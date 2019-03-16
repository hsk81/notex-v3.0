define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function buffered(arg, key, descriptor) {
        if (typeof arg === 'number') {
            return _buffered(arg);
        }
        else {
            _buffered(200)(arg, key, descriptor);
        }
    }
    exports.buffered = buffered;
    function _buffered(ms) {
        return function (target, key, descriptor) {
            let fn = descriptor ? descriptor.value : target[key], id;
            let bn = function (...args) {
                if (id !== undefined) {
                    clearTimeout(id);
                    id = undefined;
                }
                if (id === undefined) {
                    id = setTimeout(() => {
                        fn.apply(this, args);
                        id = undefined;
                    }, ms);
                }
            };
            for (let el in fn) {
                if (fn.hasOwnProperty(el)) {
                    bn[el] = fn[el];
                }
            }
            bn.cancel = function () {
                if (id !== undefined) {
                    clearTimeout(id);
                    id = undefined;
                }
            };
            if (descriptor) {
                descriptor.value = bn;
            }
            else {
                target[key] = bn;
            }
        };
    }
    exports.default = buffered;
});
//# sourceMappingURL=buffered.js.map