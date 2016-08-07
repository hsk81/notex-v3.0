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
            this._scroll = new IScroll('#md-wrap', {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
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
            this._scroll.refresh();
        };
        MdEditorToolbar.prototype.onUndoClick = function (ev) {
            this.$textarea.one('focus', function () {
                var result = document.execCommand('undo');
                if (result !== true) {
                    console.debug('[on:undo]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onRedoClick = function (ev) {
            this.$textarea.one('focus', function () {
                var result = document.execCommand('redo');
                if (result !== true) {
                    console.debug('[on:redo]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onEraseClick = function (ev) {
            this.$textarea.one('focus', function () {
                var result = document.execCommand('delete');
                if (result !== true) {
                    console.debug('[on:erase]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onScissorsClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                _this._text = val.slice(beg, end);
                var result = document.execCommand('cut');
                if (result !== true) {
                    console.debug('[on:cut]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                _this.text = val.slice(beg, end);
                var result = document.execCommand('copy');
                if (result !== true) {
                    console.debug('[on:copy]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var result = document.execCommand('insertText', true, _this.text);
                if (result !== true) {
                    console.debug('[on:insertText]');
                }
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onIndentLeftClick = function (ev) {
            this.$textarea.one('focus', function () {
                console.debug('[on:focus]');
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onIndentRightClick = function (ev) {
            this.$textarea.one('focus', function () {
                console.debug('[on:focus]');
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
        Object.defineProperty(MdEditorToolbar.prototype, "text", {
            get: function () {
                return this._text || '';
            },
            set: function (value) {
                this._text = value;
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