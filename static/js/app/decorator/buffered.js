define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:app/decorator/buffered.ts]');
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
            var fn = descriptor ? descriptor.value : target[key], id;
            var bn = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (id !== undefined) {
                    clearTimeout(id);
                    id = undefined;
                }
                if (id === undefined) {
                    id = setTimeout(function () {
                        fn.apply(_this, args);
                        id = undefined;
                    }, ms);
                }
            };
            for (var el in fn) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = buffered;
});
//# sourceMappingURL=buffered.js.map