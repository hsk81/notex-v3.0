var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../decorator/named", "../decorator/trace"], function (require, exports, named_1, trace_1) {
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
        SpellChecker = __decorate([
            trace_1.trace,
            named_1.named('SpellChecker'),
            __metadata("design:paramtypes", [Object, Function])
        ], SpellChecker);
        return SpellChecker;
    }());
    exports.SpellChecker = SpellChecker;
    exports.default = SpellChecker;
});
//# sourceMappingURL=spell-checker.js.map