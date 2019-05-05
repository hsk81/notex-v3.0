define(["require", "exports", "@npm/ipfs"], function (require, exports, IPFS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buffer = IPFS.Buffer;
    var Ipfs = /** @class */ (function () {
        function Ipfs() {
        }
        Object.defineProperty(Ipfs, "me", {
            get: function () {
                var _this = this;
                if (this['_me'] === undefined) {
                    this['_me'] = window['IPFS'] = new IPFS({
                        silent: true
                    });
                    return new Promise(function (resolve, reject) {
                        _this['_me'].once('ready', function () {
                            resolve(_this['_me']);
                        });
                        _this['_me'].once('error', function (e) {
                            reject(e);
                        });
                    });
                }
                return Promise.resolve(this['_me']);
            },
            enumerable: true,
            configurable: true
        });
        return Ipfs;
    }());
    exports.Ipfs = Ipfs;
    window['Ipfs'] = Ipfs;
    exports.default = Ipfs;
});
//# sourceMappingURL=index.js.map