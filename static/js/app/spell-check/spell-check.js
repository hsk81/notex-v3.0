define(["require", "exports"], function (require, exports) {
    "use strict";
    var SpellCheck = (function () {
        function SpellCheck() {
            var _this = this;
            var rx_word_bas = "!\"'#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~", rx_word_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿", rx_word_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾", rx_word_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎", rx_word_xxx = "≈≡×";
            var rx_word = new RegExp("^[^" + rx_word_bas + rx_word_ext + rx_word_sup + rx_word_sub + rx_word_xxx + "\\d\\s]{2,}");
            this._overlay = {
                token: function (stream) {
                    if (stream.match(rx_word)) {
                        if (_this.typo && !_this.typo.check(stream.current())) {
                            return 'spell-error';
                        }
                    }
                    stream.next();
                    return null;
                }
            };
        }
        Object.defineProperty(SpellCheck, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new SpellCheck();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpellCheck.prototype, "typo", {
            get: function () {
                var _this = this;
                if (this._typo === undefined) {
                    this._typo = null;
                    {
                        var worker = new Worker('/static/js/app/spell-check/spell-check.worker.js');
                        worker.onmessage = function (ev) {
                            if (ev.data && ev.data.typo) {
                                _this._typo = Typo.prototype.load(ev.data.typo);
                            }
                        };
                        worker.postMessage({
                            lingua: 'en_US', charset: 'us-ascii'
                        });
                    }
                }
                return this._typo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpellCheck.prototype, "overlay", {
            get: function () {
                return this._overlay;
            },
            enumerable: true,
            configurable: true
        });
        return SpellCheck;
    }());
    exports.SpellCheck = SpellCheck;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SpellCheck;
});
//# sourceMappingURL=spell-check.js.map