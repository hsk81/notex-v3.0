var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../decorator/trace"], function (require, exports, trace_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let SpellChecker = class SpellChecker {
        constructor(lingua, callback) {
            let worker = new Worker('/static/js/app/spell-checker/spell-checker.worker.js');
            worker.onmessage = (ev) => {
                if (ev.data && ev.data.typo) {
                    this.typo = Typo.prototype.load(ev.data.typo);
                    callback({
                        token: (stream) => {
                            if (stream.match(this.separator)) {
                                if (!this.typo.check(stream.current())) {
                                    return 'spell-error'; // .cm-spell-error
                                }
                            }
                            stream.next();
                            return null;
                        }
                    });
                }
                else {
                    this.typo = null;
                    callback(null);
                }
            };
            worker.postMessage({
                lingua: lingua.code, charset: lingua.charset
            });
        }
        get separator() {
            if (!this._separator) {
                let rx_bas = "!\"#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~", rx_ext = "€‚ƒ„…†‡ˆ‰‹•—™›¡¢£¤¥¦§¨©ª«¬®¯°±´µ¶·¸º»¼½¾¿", rx_sup = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾", rx_sub = "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎", rx_xxx = "≈≡×";
                this._separator = new RegExp(`^[^${rx_bas}${rx_ext}${rx_sup}${rx_sub}${rx_xxx}\\d\\s]{2,}`);
            }
            return this._separator;
        }
        get typo() {
            return this._typo;
        }
        set typo(value) {
            this._typo = value;
        }
    };
    SpellChecker = __decorate([
        trace_1.trace,
        __metadata("design:paramtypes", [Object, Function])
    ], SpellChecker);
    exports.SpellChecker = SpellChecker;
    exports.default = SpellChecker;
});
//# sourceMappingURL=spell-checker.js.map