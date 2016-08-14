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
            var cursor = this.editor.getCursor(), from = { line: cursor.line, ch: 0 }, mode = this.editor.getModeAt(from);
            if (mode.name === 'markdown') {
                var line = this.editor.getLineHandle(from.line), suffix = line.text.match(/^\s+/) ? '' : ' ', prefix = '#';
                var tokens = this.editor.getLineTokens(from.line);
                if (tokens.length > 0 && tokens[0] &&
                    tokens[0].type && tokens[0].type.match(/^header/)) {
                    var match_1 = tokens[0].type.match(/header-1$/), match_2 = tokens[0].type.match(/header-2$/);
                    if (match_1 && tokens[0].string === '=' ||
                        match_2 && tokens[0].string === '-') {
                        prefix += tokens[0].string === '=' ? '#' : '##';
                        this.editor.replaceRange('', from, {
                            ch: line.text.length, line: from.line,
                        });
                        this.editor.replaceRange(prefix + suffix, {
                            ch: 0, line: from.line - 1,
                        });
                        this.editor.setCursor({
                            ch: tokens[0].string === '=' ? 3 : 4,
                            line: from.line - 1,
                        });
                    }
                    else if (tokens[0].type.match(/header-6$/)) {
                        var match = line.text.match(/#{6,}\s*/), match_string = match && match.toString();
                        this.editor.replaceRange('', from, {
                            ch: match_string ? match_string.length : 6,
                            line: from.line
                        });
                    }
                    else {
                        this.editor.replaceRange(prefix, from);
                    }
                }
                else {
                    this.editor.replaceRange(prefix + suffix, from);
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