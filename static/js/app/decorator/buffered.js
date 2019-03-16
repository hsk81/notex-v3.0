define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function buffered(arg, key, tpd) {
        if (typeof arg === "number") {
            return _buffered(arg);
        }
        else {
            return _buffered()(arg, key, tpd);
        }
    }
    exports.buffered = buffered;
    function _buffered(ms) {
        return (tgt, key, tpd) => {
            if (tpd) {
                tpd.value = buffer(tpd.value, ms);
                return tpd;
            }
            else {
                tgt[key] = buffer(tgt[key], ms);
            }
        };
    }
    function buffer(fn, ms = 200) {
        let id;
        const bn = function (...args) {
            return new Promise((resolve) => {
                clearTimeout(id);
                id = setTimeout(() => resolve(fn.apply(this, args)), ms);
            });
        };
        bn.cancel = () => {
            clearTimeout(id);
        };
        return bn;
    }
    exports.buffer = buffer;
    exports.default = buffered;
});
//# sourceMappingURL=buffered.js.map