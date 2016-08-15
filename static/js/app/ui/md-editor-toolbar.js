var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../decorator/named', '../decorator/trace'], function (require, exports, named_1, trace_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-toolbar.ts]');
    var MdEditorToolbar = (function () {
        function MdEditorToolbar() {
            this.$undo
                .on('click', this.onUndoClick.bind(this));
            this.$redo
                .on('click', this.onRedoClick.bind(this));
            this.$cut
                .on('click', this.onCutClick.bind(this));
            this.$copy
                .on('click', this.onCopyClick.bind(this));
            this.$paste
                .on('click', this.onPasteClick.bind(this));
            this.$erase
                .on('click', this.onEraseClick.bind(this));
            this.$header
                .on('click', this.onHeaderClick.bind(this));
            this.$bold
                .on('click', this.onBoldClick.bind(this));
            this.$italic
                .on('click', this.onItalicClick.bind(this));
            this.$font
                .on('click', this.onFontClick.bind(this));
            this.refresh();
        }
        Object.defineProperty(MdEditorToolbar, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MdEditorToolbar();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditorToolbar.prototype.refresh = function () {
            this.scroll.refresh();
            this.editor.refresh();
        };
        MdEditorToolbar.prototype.onUndoClick = function () {
            this.editor.execCommand('undo');
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onRedoClick = function () {
            this.editor.execCommand('redo');
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onCutClick = function () {
            this.clipboard = this.editor.getSelection();
            this.editor.replaceSelection('');
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function () {
            try {
                document.execCommand('copy');
            }
            catch (ex) {
                console.error(ex);
            }
            this.clipboard = this.editor.getSelection();
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function () {
            this.editor.replaceSelection(this.clipboard);
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onEraseClick = function () {
            this.editor.replaceSelection('');
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onHeaderClick = function (ev) {
            var cursor = this.editor.getCursor(), curr_from = { line: cursor.line, ch: 0 }, next_from = { line: cursor.line + 1, ch: 0 };
            var curr_ts = this.editor.getLineTokens(curr_from.line), next_ts = this.editor.getLineTokens(next_from.line);
            var line = this.editor.getLineHandle(curr_from.line), mode = this.editor.getModeAt(curr_from);
            var suffix = line.text.match(/^\s+/) ? '' : ' ', prefix = '#';
            var hs = curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/^header/);
            });
            var h1s = line.text.match(/^\s*=/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-1$/) &&
                    tok.string === '=';
            });
            var h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-2$/) &&
                    tok.string === '-';
            });
            var h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-6$/) &&
                    tok.string === '#';
            });
            if (mode && mode.name === 'markdown') {
                if (hs && hs.length > 0) {
                    if (h1s && h1s.length > 0) {
                        this.editor.replaceRange('', curr_from, {
                            ch: 0, line: curr_from.line + 1
                        });
                        this.editor.replaceRange('#' + prefix + suffix, {
                            ch: 0, line: curr_from.line - 1
                        });
                        this.editor.setCursor({
                            ch: 3, line: curr_from.line - 1
                        });
                    }
                    else if (h2s && h2s.length > 0) {
                        this.editor.replaceRange('', curr_from, {
                            ch: 0, line: curr_from.line + 1
                        });
                        this.editor.replaceRange('##' + prefix + suffix, {
                            ch: 0, line: curr_from.line - 1
                        });
                        this.editor.setCursor({
                            ch: 4, line: curr_from.line - 1
                        });
                    }
                    else if (h6s && h6s.length > 0) {
                        this.editor.replaceRange('', curr_from, {
                            ch: line.text.match(/\s*#{6}\s*/).toString().length,
                            line: curr_from.line,
                        });
                    }
                    else {
                        this.editor.replaceRange(prefix, {
                            ch: hs[0].start, line: curr_from.line
                        });
                    }
                }
                else {
                    if (next_ts.length > 0) {
                        var next_tok = next_ts[next_ts.length - 1];
                        if (next_tok.type && next_tok.type.match(/^header/)) {
                            if (next_tok.string === '=' &&
                                next_tok.type.match(/header-1$/)) {
                                this.editor.replaceRange('', next_from, {
                                    line: next_from.line + 1, ch: 0
                                });
                                prefix += '#';
                            }
                            if (next_tok.string === '-' &&
                                next_tok.type.match(/header-2$/)) {
                                this.editor.replaceRange('', next_from, {
                                    line: next_from.line + 1, ch: 0
                                });
                                prefix += '##';
                            }
                        }
                    }
                    this.editor.replaceRange(prefix + suffix, curr_from);
                }
            }
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onBoldClick = function () {
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onItalicClick = function () {
            this.editor.focus();
        };
        MdEditorToolbar.prototype.onFontClick = function () {
            this.editor.focus();
        };
        Object.defineProperty(MdEditorToolbar.prototype, "$undo", {
            get: function () {
                return $('.glyphicon.undo').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$redo", {
            get: function () {
                return $('.glyphicon.redo').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$cut", {
            get: function () {
                return $('.glyphicon-scissors').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$copy", {
            get: function () {
                return $('.glyphicon-copy').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$paste", {
            get: function () {
                return $('.glyphicon-paste').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$erase", {
            get: function () {
                return $('.glyphicon-erase').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$header", {
            get: function () {
                return $('.glyphicon-header').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$bold", {
            get: function () {
                return $('.glyphicon-bold').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$italic", {
            get: function () {
                return $('.glyphicon-italic').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$font", {
            get: function () {
                return $('.glyphicon-font').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "scroll", {
            get: function () {
                if (this._scroll === undefined) {
                    this._scroll = new IScroll('#md-wrap', {
                        interactiveScrollbars: true,
                        mouseWheel: true,
                        scrollbars: true
                    });
                }
                return this._scroll;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "editor", {
            get: function () {
                return window['CODE_MIRROR'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "clipboard", {
            get: function () {
                if (this._clipboard === undefined) {
                    this._clipboard = '';
                }
                return this._clipboard;
            },
            set: function (value) {
                this._clipboard = value;
            },
            enumerable: true,
            configurable: true
        });
        MdEditorToolbar = __decorate([
            trace_1.trace,
            named_1.named('MdEditorToolbar'), 
            __metadata('design:paramtypes', [])
        ], MdEditorToolbar);
        return MdEditorToolbar;
    }());
    exports.MdEditorToolbar = MdEditorToolbar;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MdEditorToolbar;
});
//# sourceMappingURL=md-editor-toolbar.js.map