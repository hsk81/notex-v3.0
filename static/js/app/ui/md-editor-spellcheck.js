define(["require", "exports"], function (require, exports) {
    "use strict";
    var MdEditorSpellCheck = (function () {
        function MdEditorSpellCheck() {
            var _this = this;
            this.affPath = 'static/js/lib/dictionary/en_US.aff';
            this.dicPath = 'static/js/lib/dictionary/en_US.dic';
            var rx_word_bas = "!\"'#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~", rx_word_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿", rx_word_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾", rx_word_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎", rx_word_xxx = "≈≡×";
            var rx_word = new RegExp("^[^" + rx_word_bas + rx_word_ext + rx_word_sup + rx_word_sub + rx_word_xxx + "\\d\\s]{2,}");
            this._overlay = {
                token: function (stream, state) {
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
        Object.defineProperty(MdEditorSpellCheck, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MdEditorSpellCheck();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorSpellCheck.prototype, "typo", {
            get: function () {
                var _this = this;
                if (this._typo === undefined) {
                    this._typo = null;
                    {
                        var xhr_aff_1 = new XMLHttpRequest();
                        xhr_aff_1.open('GET', this.affPath, true);
                        xhr_aff_1.onload = function () {
                            if (xhr_aff_1.status === 200 &&
                                xhr_aff_1.readyState === 4) {
                                var xhr_dic_1 = new XMLHttpRequest();
                                xhr_dic_1.open('GET', _this.dicPath, true);
                                xhr_dic_1.onload = function () {
                                    if (xhr_dic_1.status === 200 &&
                                        xhr_dic_1.readyState === 4) {
                                        var aff = xhr_aff_1.responseText, dic = xhr_dic_1.responseText;
                                        _this._typo = new Typo('en_US', aff, dic, {
                                            platform: 'any'
                                        });
                                    }
                                };
                                xhr_dic_1.send(null);
                            }
                        };
                        xhr_aff_1.send(null);
                    }
                }
                return this._typo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorSpellCheck.prototype, "overlay", {
            get: function () {
                return this._overlay;
            },
            enumerable: true,
            configurable: true
        });
        return MdEditorSpellCheck;
    }());
    exports.MdEditorSpellCheck = MdEditorSpellCheck;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MdEditorSpellCheck;
});
//# sourceMappingURL=md-editor-spellcheck.js.map