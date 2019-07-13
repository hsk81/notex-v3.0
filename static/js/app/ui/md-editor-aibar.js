var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../decorator/trace", "./md-editor"], function (require, exports, trace_1, md_editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MdEditorAibar = /** @class */ (function () {
        function MdEditorAibar() {
            this.events();
        }
        MdEditorAibar_1 = MdEditorAibar;
        Object.defineProperty(MdEditorAibar, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['MD_EDITOR_OVERLAY'] = new MdEditorAibar_1();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditorAibar.prototype.events = function () {
            var _this = this;
            this.onModeChange(asMode(this.ed.simple));
            $(this.ed).on('simple', function (ev, _a) {
                var value = _a.value;
                _this.onModeChange(asMode(value));
            });
            $(this.ed).on('change', function (ev) {
                _this.onEditorChange(_this.ed.empty);
            });
            this.$midButton.on('click', this.onMidButtonClick.bind(this));
        };
        MdEditorAibar.prototype.onModeChange = function (mode) {
            if (mode === 'simple') {
                this.$aibar.removeClass('mirror');
            }
            else {
                this.$aibar.addClass('mirror');
            }
            if (this.ed.empty) {
                this.$aibar.fadeIn('slow');
            }
        };
        MdEditorAibar.prototype.onEditorChange = function (empty) {
            if (empty) {
                this.$aibar.fadeIn('fast');
            }
            else {
                this.$aibar.hide();
            }
        };
        MdEditorAibar.prototype.onMidButtonClick = function () {
            return __awaiter(this, void 0, void 0, function () {
                var text, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fetch('/static/md/help.md')
                                    .then(function (res) { return res.text(); })];
                        case 1:
                            text = _a.sent();
                            this.ed.setValue(text);
                            return [3 /*break*/, 3];
                        case 2:
                            ex_1 = _a.sent();
                            console.error(ex_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Object.defineProperty(MdEditorAibar.prototype, "$aibar", {
            get: function () {
                return $('.aibar');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$lhsButton", {
            get: function () {
                return this.$aibar.find('button.lhs');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$midButton", {
            get: function () {
                return this.$aibar.find('button.mid');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$rhsButton", {
            get: function () {
                return this.$aibar.find('button.rhs');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "ed", {
            get: function () {
                return md_editor_1.MdEditor.me;
            },
            enumerable: true,
            configurable: true
        });
        var MdEditorAibar_1;
        MdEditorAibar = MdEditorAibar_1 = __decorate([
            trace_1.trace,
            __metadata("design:paramtypes", [])
        ], MdEditorAibar);
        return MdEditorAibar;
    }());
    exports.MdEditorAibar = MdEditorAibar;
    function asMode(simple) {
        return simple ? 'simple' : 'mirror';
    }
    exports.default = MdEditorAibar;
});
//# sourceMappingURL=md-editor-aibar.js.map