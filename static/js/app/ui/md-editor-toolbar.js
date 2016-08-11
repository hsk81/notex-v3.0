var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../commands/commands', '../commands/commands', '../function/after', '../decorator/named', '../decorator/trace'], function (require, exports, commands_1, commands_2, after_1, named_1, trace_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-toolbar.ts]');
    var MdEditorToolbar = (function () {
        function MdEditorToolbar() {
            this._snapshot = null;
            this.$undo
                .on('click', this.onUndoClick.bind(this));
            this.$redo
                .on('click', this.onRedoClick.bind(this));
            this.$scissors
                .on('click', this.onScissorsClick.bind(this));
            this.$copy
                .on('click', this.onCopyClick.bind(this));
            this.$paste
                .on('click', this.onPasteClick.bind(this));
            this.$erase
                .on('click', this.onEraseClick.bind(this));
            this.$textarea
                .on('keypress', this.onTextAreaKeyPress.bind(this));
            this.$textarea
                .on('keydown', this.onTextAreaKeyDown.bind(this));
            this.$textarea
                .on('keyup', this.onTextAreaKeyUp.bind(this));
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
        MdEditorToolbar.prototype.onScissorsClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                var txt = _this.clipboard, len = Math.abs(end - beg);
                if (len)
                    _this.commands.run(new commands_2.Command(after_1.after(function () {
                        _this.$textarea[0].value =
                            val.slice(0, beg) + val.slice(end);
                        _this.$textarea[0].setSelectionRange(beg, beg);
                        _this.$textarea.focus();
                    }, function () {
                        _this.clipboard = val.slice(beg, end);
                    }), after_1.after(function () {
                        _this.$textarea[0].value = val;
                        _this.$textarea[0].setSelectionRange(beg, end);
                        _this.$textarea.focus();
                    }, function () {
                        _this.clipboard = txt;
                    })));
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                try {
                    document.execCommand('copy');
                }
                catch (ex) {
                    console.error(ex);
                }
                _this.clipboard = val.slice(beg, end);
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                var txt = _this.clipboard, len = txt.length;
                _this.commands.run(new commands_2.Command(after_1.after(function () {
                    _this.$textarea[0].value =
                        val.slice(0, beg) + txt + val.slice(end);
                    _this.$textarea[0].setSelectionRange(beg + len, beg + len);
                    _this.$textarea.focus();
                }, function () {
                    _this.clipboard = txt;
                }), after_1.after(function () {
                    _this.$textarea[0].value = val;
                    _this.$textarea[0].setSelectionRange(beg, end);
                    _this.$textarea.focus();
                }, function () {
                    _this.clipboard = txt;
                })));
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onEraseClick = function (ev) {
            var _this = this;
            this.$textarea.one('focus', function () {
                var beg = _this.$textarea[0].selectionStart, end = _this.$textarea[0].selectionEnd, val = _this.$textarea[0].value;
                var txt = val.slice(beg, end), len = txt.length;
                if (len)
                    _this.commands.run(new commands_2.Command(function () {
                        _this.$textarea[0].value =
                            val.slice(0, beg) + val.slice(end);
                        _this.$textarea[0].setSelectionRange(beg, beg);
                        _this.$textarea.focus();
                    }, function () {
                        _this.$textarea[0].value = val;
                        _this.$textarea[0].setSelectionRange(beg, end);
                        _this.$textarea.focus();
                    }));
            });
            this.$textarea.focus();
        };
        MdEditorToolbar.prototype.onTextAreaKeyPress = function (ev) {
            switch (ev.key) {
                case 'z':
                    return this.onLowerZKeyPress(ev);
                case 'Z':
                    return this.onUpperZKeyPress(ev);
            }
        };
        MdEditorToolbar.prototype.onLowerZKeyPress = function (ev) {
            if (ev.ctrlKey) {
                this.commands.undo();
                return false;
            }
        };
        MdEditorToolbar.prototype.onUpperZKeyPress = function (ev) {
            if (ev.ctrlKey) {
                this.commands.redo();
                return false;
            }
        };
        MdEditorToolbar.prototype.onTextAreaKeyDown = function (ev) {
            switch (ev.key) {
                case 'c':
                    return this.onLowerCKeyDown(ev);
                case 'v':
                    return this.onLowerVKeyDown(ev);
                case 'x':
                    return this.onLowerXKeyDown(ev);
                case 'Delete':
                    return this.onDeleteKeyDown(ev);
            }
        };
        MdEditorToolbar.prototype.onLowerCKeyDown = function (ev) {
            if (ev.ctrlKey) {
                this.$copy.click();
                return false;
            }
        };
        MdEditorToolbar.prototype.onLowerVKeyDown = function (ev) {
            if (ev.ctrlKey) {
                this.$paste.click();
                return false;
            }
        };
        MdEditorToolbar.prototype.onLowerXKeyDown = function (ev) {
            if (ev.ctrlKey) {
                this.$scissors.click();
                return false;
            }
        };
        MdEditorToolbar.prototype.onDeleteKeyDown = function (ev) {
            if (ev.ctrlKey && !ev.shiftKey) {
                this.$erase.click();
                return false;
            }
            else {
                var beg = this.$textarea[0].selectionStart, end = this.$textarea[0].selectionEnd, val = this.$textarea[0].value;
                var dif = Math.abs(end - beg), bit = dif > 0 ? 0 : 1;
                var to_bet = val.slice(0, beg), to_end = val.slice(end + bit, val.length);
                this.$textarea[0].value = to_bet + to_end;
                this.$textarea[0].setSelectionRange(beg, beg);
                if (this._snapshot === null) {
                    this._snapshot = {
                        beg: beg, end: end, val: val
                    };
                }
                return false;
            }
        };
        MdEditorToolbar.prototype.onTextAreaKeyUp = function (ev) {
            switch (ev.key) {
                case 'Delete':
                    return this.onDeleteKeyUp(ev);
            }
        };
        MdEditorToolbar.prototype.onDeleteKeyUp = function (ev) {
            var _this = this;
            if (!ev.ctrlKey && !ev.shiftKey) {
                var old_beg_1 = this._snapshot.beg, old_end_1 = this._snapshot.end, old_val_1 = this._snapshot.val;
                var new_beg_1 = this.$textarea[0].selectionStart, new_end_1 = this.$textarea[0].selectionEnd, new_val_1 = this.$textarea[0].value;
                this._snapshot = null;
                this.$textarea.focus();
                this.commands.add(new commands_2.Command(function () {
                    _this.$textarea[0].value = new_val_1;
                    _this.$textarea[0].setSelectionRange(new_beg_1, new_end_1);
                    _this.$textarea.focus();
                }, function () {
                    _this.$textarea[0].value = old_val_1;
                    _this.$textarea[0].setSelectionRange(old_beg_1, old_end_1);
                    _this.$textarea.focus();
                }));
                return false;
            }
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
        Object.defineProperty(MdEditorToolbar.prototype, "$erase", {
            get: function () {
                return $('.glyphicon-erase').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$scissors", {
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