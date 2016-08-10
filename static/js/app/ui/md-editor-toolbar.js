var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../commands/commands', '../commands/commands', '../decorator/named', '../decorator/trace'], function (require, exports, commands_1, commands_2, named_1, trace_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-toolbar.ts]');
    var MdEditorToolbar = (function () {
        function MdEditorToolbar() {
            $('.glyphicon.undo').closest('button')
                .on('click', this.onUndoClick.bind(this));
            $('.glyphicon.redo').closest('button')
                .on('click', this.onRedoClick.bind(this));
            $('.glyphicon-erase').closest('button')
                .on('click', this.onEraseClick.bind(this));
            $('.glyphicon-scissors').closest('button')
                .on('click', this.onScissorsClick.bind(this));
            $('.glyphicon-copy').closest('button')
                .on('click', this.onCopyClick.bind(this));
            $('.glyphicon-paste').closest('button')
                .on('click', this.onPasteClick.bind(this));
            $('.glyphicon-indent-left').closest('button')
                .on('click', this.onIndentLeftClick.bind(this));
            $('.glyphicon-indent-right').closest('button')
                .on('click', this.onIndentRightClick.bind(this));
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
        };
        MdEditorToolbar.prototype.onUndoClick = function (ev) {
            this.commands.undo();
        };
        MdEditorToolbar.prototype.onRedoClick = function (ev) {
            this.commands.redo();
        };
        MdEditorToolbar.prototype.onEraseClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                _this.commands.run(new commands_2.Command(function () {
                    _this.$textarea[0].value =
                        val.slice(0, beg) + val.slice(end);
                    _this.$textarea[0].setSelectionRange(beg, beg);
                    _this.$textarea.focus();
                }, function () {
                    _this.$textarea[0].value = val;
                    _this.$textarea[0].setSelectionRange(end, end);
                    _this.$textarea.focus();
                }));
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onScissorsClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                _this.clipboard = val.slice(beg, end);
                var result = document.execCommand('cut');
                if (result !== true) {
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                _this.clipboard = val.slice(beg, end);
                var result = document.execCommand('copy');
                if (result !== true) {
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var result = document.execCommand('insertText', true, _this.clipboard);
                if (result !== true) {
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onIndentLeftClick = function (ev) {
            this.$textarea.one('focus', function () {
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onIndentRightClick = function (ev) {
            this.$textarea.one('focus', function () {
            });
            this.$textarea.focus();
        };
        Object.defineProperty(MdEditorToolbar.prototype, "$textarea", {
            get: function () {
                return $('textarea#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "commands", {
            get: function () {
                if (this._commands === undefined) {
                    this._commands = new commands_1.Commands();
                }
                return this._commands;
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