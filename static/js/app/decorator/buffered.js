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
        return function (tgt, key, tpd) {
            if (tpd) {
                tpd.value = buffer(tpd.value, ms);
                return tpd;
            }
            else {
                tgt[key] = buffer(tgt[key], ms);
            }
        };
    }
    function buffer(fn, ms) {
        if (ms === void 0) { ms = 200; }
        var id;
        var bn = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve) {
                clearTimeout(id);
                id = setTimeout(function () { return resolve(fn.apply(_this, args)); }, ms);
            });
        };
        bn.cancel = function () {
            clearTimeout(id);
        };
        return bn;
    }
    exports.buffer = buffer;
    exports.default = buffered;
});
//# sourceMappingURL=buffered.js.map