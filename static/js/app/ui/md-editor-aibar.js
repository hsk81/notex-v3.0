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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
    var AiMode;
    (function (AiMode) {
        AiMode["help"] = "ai-help";
        AiMode["none"] = "ai-none";
    })(AiMode = exports.AiMode || (exports.AiMode = {}));
    var MdEditorAibar = /** @class */ (function () {
        function MdEditorAibar() {
            var _this = this;
            if (this.ed.empty) {
                this.$aibar.fadeIn('slow', function () {
                    _this.$aibar.find('[data-toggle="tooltip"]').tooltip();
                    _this.$aibar.find('[data-toggle="popover"]').popover();
                });
                this.$output.css({
                    height: 'calc(100% - 47px)'
                });
            }
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
            $(this.ed).on('ui-mode', function (ev, _a) {
                var value = _a.value;
                _this.onUiModeChange(value);
            });
            $(this.ed).on('change', function (ev) {
                _this.onEditorChange(_this.ed.empty);
            });
            $(this.ed).on('ai-mode', function (ev, _a) {
                var value = _a.value;
                _this.onAiMode(value);
            });
            $(this.ed).on('ai-page', function (ev, _a) {
                var value = _a.value;
                _this.onAiPage(value);
            });
            this.$lhsButton.on('click', this.onLhsButtonClick.bind(this));
            this.$midButton.on('click', this.onMidButtonClick.bind(this));
            this.$rhsButton.on('click', this.onRhsButtonClick.bind(this));
        };
        MdEditorAibar.prototype.onUiModeChange = function (mode) {
            if (this.ed.empty) {
                this.$aibar.fadeIn('slow');
            }
        };
        MdEditorAibar.prototype.onEditorChange = function (empty) {
            var _this = this;
            if (empty || this.aiMode === AiMode.help) {
                this.$aibar.fadeIn('fast', function () { return _this.$output.css({
                    height: 'calc(100% - 47px)'
                }); });
            }
            else {
                this.$output.css({
                    height: 'calc(100%)'
                });
                this.$aibar.hide();
            }
        };
        MdEditorAibar.prototype.onRhsButtonClick = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.aiPage !== undefined && this.aiPage < Infinity) {
                        this.aiPage += 1;
                    }
                    else {
                        this.aiMode = AiMode.help;
                    }
                    return [2 /*return*/];
                });
            });
        };
        MdEditorAibar.prototype.onLhsButtonClick = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.aiPage !== undefined && this.aiPage > 0) {
                        this.aiPage -= 1;
                    }
                    else {
                        this.aiMode = AiMode.help;
                    }
                    return [2 /*return*/];
                });
            });
        };
        MdEditorAibar.prototype.onMidButtonClick = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.aiMode !== AiMode.help) {
                        this.aiMode = AiMode.help;
                    }
                    else {
                        this.aiMode = AiMode.none;
                    }
                    return [2 /*return*/];
                });
            });
        };
        MdEditorAibar.prototype.onAiMode = function (mode) {
            if (mode !== AiMode.help) {
                this.$midButton.text('Help');
            }
            else {
                this.$midButton.text('Exit');
            }
            if (mode !== AiMode.help) {
                this.aiPage = undefined;
            }
            else {
                this.aiPage = 0;
            }
        };
        MdEditorAibar.prototype.onAiPage = function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var help;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(page !== undefined)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.fetch(page)];
                        case 1:
                            help = _a.sent();
                            if (help !== null) {
                                this.ed.setValue(help);
                            }
                            else {
                                this.aiMode = AiMode.none;
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            this.ed.clear();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MdEditorAibar.prototype.fetch = function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var padded, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            padded = page.toString(16).padStart(4, '0');
                            path = "/static/md/help-" + padded.toUpperCase() + ".md";
                            return [4 /*yield*/, fetch(path)
                                    .then(function (res) {
                                    return res.ok ? res.text() : Promise.resolve(null);
                                })
                                    .catch(function (reason) {
                                    return null;
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Object.defineProperty(MdEditorAibar.prototype, "aiMode", {
            get: function () {
                return window['ai-mode'];
            },
            set: function (value) {
                $(this.ed).trigger('ai-mode', {
                    value: window['ai-mode'] = value
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "aiPage", {
            get: function () {
                return window['ai-page'];
            },
            set: function (value) {
                $(this.ed).trigger('ai-page', {
                    value: window['ai-page'] = value
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$aibar", {
            get: function () {
                return $('.aibar');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$lhsButton", {
            get: function () {
                return this.$aibar.find('button.ai-lhs');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$midButton", {
            get: function () {
                return this.$aibar.find('button.ai-mid');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$rhsButton", {
            get: function () {
                return this.$aibar.find('button.ai-rhs');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorAibar.prototype, "$output", {
            get: function () {
                return $('#output');
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
    exports.default = MdEditorAibar;
});
//# sourceMappingURL=md-editor-aibar.js.map