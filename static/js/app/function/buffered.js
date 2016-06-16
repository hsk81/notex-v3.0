define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:buffered.ts]');
    function buffered(fn, ms) {
        if (ms === void 0) { ms = 200; }
        var id, gn = function () {
            var self = this, args = arguments;
            if (id !== undefined) {
                clearTimeout(id);
                id = undefined;
            }
            if (id === undefined) {
                id = setTimeout(function () {
                    fn.apply(self, args);
                    id = undefined;
                }, ms);
            }
        };
        gn.cancel = function () {
            if (id !== undefined) {
                clearTimeout(id);
                id = undefined;
            }
        };
        return gn;
    }
    exports.buffered = buffered;
    exports.__esModule = true;
    exports["default"] = buffered;
});
//# sourceMappingURL=buffered.js.map