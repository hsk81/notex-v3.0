var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../commands/commands', '../commands/commands', './md-editor', '../decorator/named', '../decorator/trace', '../function/seq'], function (require, exports, commands_1, commands_2, md_editor_1, named_1, trace_1, seq_1) {
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
            this.$mdInp
                .on('keypress', this.onMdInpKeyPress.bind(this));
            this.$mdInp
                .on('keydown', this.onMdInpKeyDown.bind(this));
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
        };
        MdEditorToolbar.prototype.onUndoClick = function (ev) {
            this.commands.undo();
        };
        MdEditorToolbar.prototype.onRedoClick = function (ev) {
            this.commands.redo();
        };
        MdEditorToolbar.prototype.onCutClick = function (ev) {
            var _this = this;
            this.$mdInp.one('focus', function () {
                var beg = _this.$mdInp[0].selectionStart, end = _this.$mdInp[0].selectionEnd, val = _this.$mdInp[0].value;
                var txt = _this.clipboard, len = Math.abs(end - beg);
                if (len)
                    _this.commands.run(new commands_2.Command(seq_1.seq(function () {
                        _this.$mdInp[0].value = val.slice(0, beg) + val.slice(end);
                        _this.$mdInp[0].setSelectionRange(beg, beg);
                        _this.$mdInp.focus();
                    }, function () {
                        _this.clipboard = val.slice(beg, end);
                    }, function () {
                        _this.render();
                    }), seq_1.seq(function () {
                        _this.$mdInp[0].value = val;
                        _this.$mdInp[0].setSelectionRange(beg, end);
                        _this.$mdInp.focus();
                    }, function () {
                        _this.clipboard = txt;
                    }, function () {
                        _this.render();
                    })));
            });
            this.$mdInp.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function (ev) {
            var _this = this;
            this.$mdInp.one('focus', function () {
                var beg = _this.$mdInp[0].selectionStart, end = _this.$mdInp[0].selectionEnd, val = _this.$mdInp[0].value;
                try {
                    document.execCommand('copy');
                }
                catch (ex) {
                    console.error(ex);
                }
                _this.clipboard = val.slice(beg, end);
            });
            this.$mdInp.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function (ev) {
            var _this = this;
            this.$mdInp.one('focus', function () {
                var beg = _this.$mdInp[0].selectionStart, end = _this.$mdInp[0].selectionEnd, val = _this.$mdInp[0].value;
                var txt = _this.clipboard, len = txt.length;
                _this.commands.run(new commands_2.Command(seq_1.seq(function () {
                    _this.$mdInp[0].value =
                        val.slice(0, beg) + txt + val.slice(end);
                    _this.$mdInp[0].setSelectionRange(beg + len, beg + len);
                    _this.$mdInp.focus();
                }, function () {
                    _this.clipboard = txt;
                }, function () {
                    _this.render();
                }), seq_1.seq(function () {
                    _this.$mdInp[0].value = val;
                    _this.$mdInp[0].setSelectionRange(beg, end);
                    _this.$mdInp.focus();
                }, function () {
                    _this.clipboard = txt;
                }, function () {
                    _this.render();
                })));
            });
            this.$mdInp.focus();
        };
        MdEditorToolbar.prototype.onEraseClick = function (ev) {
            var _this = this;
            this.$mdInp.one('focus', function () {
                var beg = _this.$mdInp[0].selectionStart, end = _this.$mdInp[0].selectionEnd, val = _this.$mdInp[0].value;
                var txt = val.slice(beg, end), len = txt.length;
                if (len)
                    _this.commands.run(new commands_2.Command(seq_1.seq(function () {
                        _this.$mdInp[0].value = val.slice(0, beg) + val.slice(end);
                        _this.$mdInp[0].setSelectionRange(beg, beg);
                        _this.$mdInp.focus();
                    }, function () {
                        _this.render();
                    }), seq_1.seq(function () {
                        _this.$mdInp[0].value = val;
                        _this.$mdInp[0].setSelectionRange(beg, end);
                        _this.$mdInp.focus();
                    }, function () {
                        _this.render();
                    })));
            });
            this.$mdInp.focus();
        };
        MdEditorToolbar.prototype.onMdInpKeyPress = function (ev) {
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
        MdEditorToolbar.prototype.onMdInpKeyDown = function (ev) {
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
                this.$cut.click();
                return false;
            }
        };
        MdEditorToolbar.prototype.onDeleteKeyDown = function (ev) {
            if (ev.ctrlKey && !ev.shiftKey) {
                this.$erase.click();
                return false;
            }
        };
        MdEditorToolbar.prototype.render = function () {
            md_editor_1.MdEditor.me.render();
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
        Object.defineProperty(MdEditorToolbar.prototype, "$mdInp", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "commands", {
            get: function () {
                return commands_1.Commands.me;
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