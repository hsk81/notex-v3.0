define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpellChecker = /** @class */ (function () {
        function SpellChecker(lingua, callback) {
            var _this = this;
            var worker = new Worker('/static/js/app/spell-checker/spell-checker.worker.js');
            worker.onmessage = function (ev) {
                if (ev.data && ev.data.typo) {
                    _this.typo = Typo.prototype.load(ev.data.typo);
                    callback({
                        token: function (stream) {
                            if (stream.match(_this.separator)) {
                                if (!_this.typo.check(stream.current())) {
                                    return 'spell-error'; // .cm-spell-error
                                }
                            }
                            stream.next();
                            return null;
                        }
                    });
                }
                else {
                    _this.typo = null;
                    callback(null);
                }
            };
            worker.postMessage({
                lingua: lingua.code, charset: lingua.charset
            });
        }
        Object.defineProperty(SpellChecker.prototype, "separator", {
            get: function () {
                if (!this._separator) {
                    var rx_bas = "!\"#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~", rx_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿", rx_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾", rx_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎", rx_xxx = "≈≡×";
                    this._separator = new RegExp("^[^" + rx_bas + rx_ext + rx_sup + rx_sub + rx_xxx + "\\d\\s]{2,}");
                }
                return this._separator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpellChecker.prototype, "typo", {
            get: function () {
                return this._typo;
            },
            set: function (value) {
                this._typo = value;
            },
            enumerable: true,
            configurable: true
        });
        return SpellChecker;
    }());
    exports.SpellChecker = SpellChecker;
    exports.default = SpellChecker;
});
//# sourceMappingURL=spell-checker.js.map