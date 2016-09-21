var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../decorator/named', '../decorator/trace', './md-editor'], function (require, exports, named_1, trace_1, md_editor_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-toolbar.ts]');
    var MdEditorToolbar = (function () {
        function MdEditorToolbar() {
            var _this = this;
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
                .on('click', this.onCommentClick.bind(this));
            this.$indent
                .on('click', this.onIndentClick.bind(this));
            this.$outdent
                .on('click', this.onOutdentClick.bind(this));
            this.$supscript
                .on('click', this.onSupscriptClick.bind(this));
            this.$subscript
                .on('click', this.onSubscriptClick.bind(this));
            if (!this.ed.mobile) {
                this.$outer.fadeIn('slow', function () {
                    _this.$toolbar.find('[data-toggle="tooltip"]').tooltip();
                    _this.$toolbar.find('[data-toggle="popover"]').popover();
                    _this.refresh();
                });
            }
        }
        Object.defineProperty(MdEditorToolbar, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['MD_EDITOR_TOOLBAR'] = new MdEditorToolbar();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditorToolbar.prototype.refresh = function () {
            this.ed.refresh();
            this.scroll.refresh();
        };
        MdEditorToolbar.prototype.onUndoClick = function () {
            if (this.ed.mirror) {
                this.ed.mirror.execCommand('undo');
            }
            else {
                try {
                    document.execCommand('undo');
                }
                catch (ex) {
                    console.error(ex);
                }
                this.ed.$input.trigger('change');
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onRedoClick = function () {
            if (this.ed.mirror) {
                this.ed.mirror.execCommand('redo');
            }
            else {
                try {
                    document.execCommand('redo');
                }
                catch (ex) {
                    console.error(ex);
                }
                this.ed.$input.trigger('change');
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onCutClick = function () {
            this.clipboard = this.ed.getSelection();
            if (this.ed.mirror) {
                this.ed.mirror.replaceSelection('');
            }
            else {
                try {
                    document.execCommand('cut');
                }
                catch (ex) {
                    console.error(ex);
                }
                this.ed.$input.trigger('change');
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onCopyClick = function () {
            this.clipboard = this.ed.getSelection();
            try {
                document.execCommand('copy');
            }
            catch (ex) {
                console.error(ex);
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onPasteClick = function () {
            if (this.ed.mirror) {
                this.ed.mirror.replaceSelection(this.clipboard);
            }
            else {
                try {
                    document.execCommand('insertText', false, this.clipboard);
                }
                catch (ex) {
                    console.error(ex);
                }
                this.ed.$input.trigger('change');
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onEraseClick = function () {
            if (this.ed.mirror) {
                this.ed.mirror.replaceSelection('');
            }
            else {
                try {
                    document.execCommand('insertText', false, '');
                }
                catch (ex) {
                    console.error(ex);
                }
                this.ed.$input.trigger('change');
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onHeaderClick = function () {
            if (this.ed.mirror) {
                this.onHeaderClickMirror();
            }
            else {
                this.onHeaderClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onHeaderClickMirror = function () {
            var cursor = this.ed.mirror.getCursor(), curr_from = { line: cursor.line, ch: 0 }, next_from = { line: cursor.line + 1, ch: 0 };
            var curr_ts = this.ed.mirror.getLineTokens(curr_from.line), next_ts = this.ed.mirror.getLineTokens(next_from.line);
            var line = this.ed.mirror.getLineHandle(curr_from.line), mode = this.ed.mirror.getModeAt(curr_from);
            var suffix = line.text.match(/^\s+/) ? '' : ' ', prefix = '#';
            var hs = curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header/);
            });
            var h1s = line.text.match(/^\s*=/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-1/) &&
                    tok.string === '=';
            });
            var h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-2/) &&
                    tok.string === '-';
            });
            var h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter(function (tok) {
                return tok && tok.type && tok.type.match(/header-6/) &&
                    tok.string === '#';
            });
            if (mode && mode.name === 'markdown') {
                if (hs && hs.length > 0) {
                    if (h1s && h1s.length > 0) {
                        this.ed.mirror.replaceRange('', curr_from, {
                            ch: 0, line: curr_from.line + 1
                        });
                        this.ed.mirror.replaceRange('#' + prefix + suffix, {
                            ch: 0, line: curr_from.line - 1
                        });
                        this.ed.mirror.setCursor({
                            ch: 3, line: curr_from.line - 1
                        });
                    }
                    else if (h2s && h2s.length > 0) {
                        this.ed.mirror.replaceRange('', curr_from, {
                            ch: 0, line: curr_from.line + 1
                        });
                        this.ed.mirror.replaceRange('##' + prefix + suffix, {
                            ch: 0, line: curr_from.line - 1
                        });
                        this.ed.mirror.setCursor({
                            ch: 4, line: curr_from.line - 1
                        });
                    }
                    else if (h6s && h6s.length > 0) {
                        this.ed.mirror.replaceRange('', curr_from, {
                            ch: line.text.match(/\s*#{6}\s*/).toString().length,
                            line: curr_from.line,
                        });
                    }
                    else {
                        this.ed.mirror.replaceRange(prefix, {
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
                                this.ed.mirror.replaceRange('', next_from, {
                                    line: next_from.line + 1, ch: 0
                                });
                                prefix += '#';
                            }
                            if (next_tok.string === '-' &&
                                next_tok.type.match(/header-2$/)) {
                                this.ed.mirror.replaceRange('', next_from, {
                                    line: next_from.line + 1, ch: 0
                                });
                                prefix += '##';
                            }
                        }
                    }
                    this.ed.mirror.replaceRange(prefix + suffix, curr_from);
                }
            }
        };
        MdEditorToolbar.prototype.onHeaderClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd, idx = beg;
            while (idx-- > 0) {
                if (val[idx] === '\n') {
                    break;
                }
            }
            var px = val.substring(0, idx + 1), sx = val.substring(idx + 1, val.length);
            var rx_6 = /^\s*#{6,}\s*/, mm_6 = sx.match(rx_6);
            var rx_5 = /^\s*#{1,5}/, mm_5 = sx.match(rx_5);
            var rx_0 = /^\s*#{0}/, mm_0 = sx.match(rx_0);
            if (mm_6 && mm_6.length > 0) {
                this.ed.$input[0].setSelectionRange(idx + 1, idx + mm_6[0].length + 1);
                if (!document.execCommand('insertText', false, '')) {
                    this.ed.$input.val("" + px + sx.replace(rx_6, ''));
                }
                this.ed.$input[0].setSelectionRange(beg - mm_6[0].length, end - mm_6[0].length);
            }
            else if (mm_5 && mm_5.length > 0) {
                this.ed.$input[0].setSelectionRange(idx + 1, idx + mm_5[0].length + 1);
                if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                    this.ed.$input.val("" + px + sx.replace(rx_5, mm_5[0] + '#'));
                }
                this.ed.$input[0].setSelectionRange(beg + 1, end + 1);
            }
            else if (mm_0 && mm_0.length > 0) {
                this.ed.$input[0].setSelectionRange(idx + 1, idx + mm_0[0].length + 1);
                if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                    this.ed.$input.val("" + px + sx.replace(rx_0, '# ' + mm_0[0]));
                }
                this.ed.$input[0].setSelectionRange(beg + mm_0[0].length + 2, end + mm_0[0].length + 2);
            }
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onBoldClick = function () {
            if (this.ed.mirror) {
                this.onBoldClickMirror();
            }
            else {
                this.onBoldClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onBoldClickMirror = function () {
            var _this = this;
            var selections = this.ed.mirror.listSelections();
            if (selections.length > 0 && this.ed.mirror.getSelection()) {
                this.ed.mirror.setSelections(selections.map(function (sel) {
                    var lhs_mod = _this.ed.mirror.getModeAt(sel.head), rhs_mod = _this.ed.mirror.getModeAt(sel.anchor);
                    if (lhs_mod && lhs_mod.name === 'markdown' &&
                        rhs_mod && rhs_mod.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel.head);
                        if (tok.type && tok.type.match(/strong/) ||
                            tok.type && tok.type.match(/em/)) {
                            return {
                                anchor: _this.lhs(sel.anchor, tok),
                                head: _this.rhs(sel.head, tok)
                            };
                        }
                        else {
                            return sel;
                        }
                    }
                    else {
                        return sel;
                    }
                }));
                this.ed.mirror.replaceSelections(selections.map(function (sel) {
                    var sel_lhs = sel.anchor, sel_rhs = sel.head;
                    if (sel_lhs.line > sel_rhs.line ||
                        sel_lhs.line === sel_rhs.line &&
                            sel_lhs.ch > sel_rhs.ch) {
                        sel_lhs = sel.head;
                        sel_rhs = sel.anchor;
                    }
                    var mod_lhs = _this.ed.mirror.getModeAt(sel_lhs), mod_rhs = _this.ed.mirror.getModeAt(sel_rhs);
                    if (mod_lhs && mod_lhs.name === 'markdown' &&
                        mod_rhs && mod_rhs.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel_rhs);
                        if (tok.type && tok.type.match(/strong/) ||
                            tok.type && tok.type.match(/em/)) {
                            var lhs = _this.lhs(sel_lhs, tok), rhs = _this.rhs(sel_rhs, tok);
                            if (tok.type.match(/em/)) {
                                return "*" + _this.ed.mirror
                                    .getRange(lhs, rhs) + "*";
                            }
                            else {
                                return _this.ed.mirror
                                    .getRange(lhs, rhs).slice(2, -2);
                            }
                        }
                        else {
                            return "**" + _this.ed.mirror
                                .getRange(sel_lhs, sel_rhs) + "**";
                        }
                    }
                    else {
                        return _this.ed.mirror
                            .getRange(sel_lhs, sel_rhs);
                    }
                }), 'around');
            }
            else {
                var cur = this.ed.mirror.getCursor(), mod = this.ed.mirror.getModeAt(cur);
                if (mod && mod.name === 'markdown') {
                    var tok = this.ed.mirror.getTokenAt(cur);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        var lhs = this.lhs(cur, tok), rhs = this.rhs(cur, tok);
                        if (tok.type.match(/em/)) {
                            var src = this.ed.mirror.getRange(lhs, rhs), tgt = "*" + src + "*";
                            this.ed.mirror.replaceRange(tgt, lhs, rhs);
                            this.ed.mirror.setSelection(lhs, {
                                line: rhs.line, ch: rhs.ch + 2
                            });
                        }
                        else {
                            var src = this.ed.mirror.getRange(lhs, rhs), tgt = src.slice(2, -2);
                            this.ed.mirror.replaceRange(tgt, lhs, rhs);
                            this.ed.mirror.setSelection(lhs, {
                                line: rhs.line, ch: rhs.ch - 4
                            });
                        }
                    }
                    else {
                        this.ed.mirror.replaceRange('****', cur);
                        this.ed.mirror.setCursor({
                            line: cur.line, ch: cur.ch + 2
                        });
                    }
                }
            }
        };
        MdEditorToolbar.prototype.onBoldClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd;
            var px_1 = val.substring(0, beg), ix_1 = val.substring(beg, end), sx_1 = val.substring(end, val.length);
            var px_2 = val.substring(0, beg - 2), ix_2 = val.substring(beg - 2, end + 2), sx_2 = val.substring(end + 2, val.length);
            var rx_1 = /^\*\*((?:(?!\*\*).)+)\*\*$/, mm_1 = ix_1.match(rx_1);
            var rx_2 = /^\*\*((?:(?!\*\*).)+)\*\*$/, mm_2 = ix_2.match(rx_2);
            if (mm_1 && mm_1.length > 1) {
                if (!document.execCommand('insertText', false, mm_1[1])) {
                    this.ed.$input.val("" + px_1 + mm_1[1] + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end - 4);
            }
            else if (mm_2 && mm_2.length > 1) {
                this.ed.$input[0].setSelectionRange(beg - 2, end + 2);
                if (!document.execCommand('insertText', false, mm_2[1])) {
                    this.ed.$input.val("" + px_2 + mm_2[1] + sx_2);
                }
                this.ed.$input[0].setSelectionRange(beg - 2, end - 2);
            }
            else {
                if (!document.execCommand('insertText', false, "**" + ix_1 + "**")) {
                    this.ed.$input.val(px_1 + "**" + ix_1 + "**" + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end + 4);
            }
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onItalicClick = function () {
            if (this.ed.mirror) {
                this.onItalicClickMirror();
            }
            else {
                this.onItalicClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onItalicClickMirror = function () {
            var _this = this;
            var selections = this.ed.mirror.listSelections();
            if (selections.length > 0 && this.ed.mirror.getSelection()) {
                this.ed.mirror.setSelections(selections.map(function (sel) {
                    var lhs_mod = _this.ed.mirror.getModeAt(sel.head), rhs_mod = _this.ed.mirror.getModeAt(sel.anchor);
                    if (lhs_mod && lhs_mod.name === 'markdown' &&
                        rhs_mod && rhs_mod.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel.head);
                        if (tok.type && tok.type.match(/strong/) ||
                            tok.type && tok.type.match(/em/)) {
                            return {
                                anchor: _this.lhs(sel.anchor, tok),
                                head: _this.rhs(sel.head, tok)
                            };
                        }
                        else {
                            return sel;
                        }
                    }
                    else {
                        return sel;
                    }
                }));
                this.ed.mirror.replaceSelections(selections.map(function (sel) {
                    var sel_lhs = sel.anchor, sel_rhs = sel.head;
                    if (sel_lhs.line > sel_rhs.line ||
                        sel_lhs.line === sel_rhs.line &&
                            sel_lhs.ch > sel_rhs.ch) {
                        sel_lhs = sel.head;
                        sel_rhs = sel.anchor;
                    }
                    var mod_lhs = _this.ed.mirror.getModeAt(sel_lhs), mod_rhs = _this.ed.mirror.getModeAt(sel_rhs);
                    if (mod_lhs && mod_lhs.name === 'markdown' &&
                        mod_rhs && mod_rhs.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel_rhs);
                        if (tok.type && tok.type.match(/strong/) ||
                            tok.type && tok.type.match(/em/)) {
                            var lhs = _this.lhs(sel_lhs, tok), rhs = _this.rhs(sel_rhs, tok);
                            return _this.ed.mirror
                                .getRange(lhs, rhs).slice(1, -1);
                        }
                        else {
                            return "*" + _this.ed.mirror
                                .getRange(sel_lhs, sel_rhs) + "*";
                        }
                    }
                    else {
                        return _this.ed.mirror
                            .getRange(sel_lhs, sel_rhs);
                    }
                }), 'around');
            }
            else {
                var cur = this.ed.mirror.getCursor(), mod = this.ed.mirror.getModeAt(cur);
                if (mod && mod.name === 'markdown') {
                    var tok = this.ed.mirror.getTokenAt(cur);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        var lhs = this.lhs(cur, tok), rhs = this.rhs(cur, tok);
                        var src = this.ed.mirror.getRange(lhs, rhs), tgt = src.slice(1, -1);
                        this.ed.mirror.replaceRange(tgt, lhs, rhs);
                        this.ed.mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 2
                        });
                    }
                    else {
                        this.ed.mirror.replaceRange('* *', cur);
                        this.ed.mirror.setSelection({
                            line: cur.line, ch: cur.ch + 1
                        }, {
                            line: cur.line, ch: cur.ch + 2
                        });
                    }
                }
            }
        };
        MdEditorToolbar.prototype.onItalicClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd;
            var px_1 = val.substring(0, beg), ix_1 = val.substring(beg, end), sx_1 = val.substring(end, val.length);
            var px_2 = val.substring(0, beg - 1), ix_2 = val.substring(beg - 1, end + 1), sx_2 = val.substring(end + 1, val.length);
            var rx_1 = /^\*([^*]+)\*$/, mm_1 = ix_1.match(rx_1);
            var rx_2 = /^\*([^*]+)\*$/, mm_2 = ix_2.match(rx_2);
            if (mm_1 && mm_1.length > 1) {
                if (!document.execCommand('insertText', false, mm_1[1])) {
                    this.ed.$input.val("" + px_1 + mm_1[1] + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end - 2);
            }
            else if (mm_2 && mm_2.length > 1) {
                this.ed.$input[0].setSelectionRange(beg - 1, end + 1);
                if (!document.execCommand('insertText', false, mm_2[1])) {
                    this.ed.$input.val("" + px_2 + mm_2[1] + sx_2);
                }
                this.ed.$input[0].setSelectionRange(beg - 1, end - 1);
            }
            else {
                if (!document.execCommand('insertText', false, "*" + ix_1 + "*")) {
                    this.ed.$input.val(px_1 + "*" + ix_1 + "*" + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end + 2);
            }
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onCommentClick = function () {
            if (this.ed.mirror) {
                this.onCommentClickMirror();
            }
            else {
                this.onCommentClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onCommentClickMirror = function () {
            var _this = this;
            var selections = this.ed.mirror.listSelections();
            if (selections.length > 0 && this.ed.mirror.getSelection()) {
                this.ed.mirror.setSelections(selections.map(function (sel) {
                    var lhs_mod = _this.ed.mirror.getModeAt(sel.head), rhs_mod = _this.ed.mirror.getModeAt(sel.anchor);
                    if (lhs_mod && lhs_mod.name === 'markdown' &&
                        rhs_mod && rhs_mod.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel.head);
                        if (tok.type && tok.type.match(/comment/)) {
                            return {
                                anchor: _this.lhs(sel.anchor, tok),
                                head: _this.rhs(sel.head, tok)
                            };
                        }
                        else {
                            return sel;
                        }
                    }
                    else {
                        return sel;
                    }
                }));
                this.ed.mirror.replaceSelections(selections.map(function (sel) {
                    var sel_lhs = sel.anchor, sel_rhs = sel.head;
                    if (sel_lhs.line > sel_rhs.line ||
                        sel_lhs.line === sel_rhs.line &&
                            sel_lhs.ch > sel_rhs.ch) {
                        sel_lhs = sel.head;
                        sel_rhs = sel.anchor;
                    }
                    var mod_lhs = _this.ed.mirror.getModeAt(sel_lhs), mod_rhs = _this.ed.mirror.getModeAt(sel_rhs);
                    if (mod_lhs && mod_lhs.name === 'markdown' &&
                        mod_rhs && mod_rhs.name === 'markdown') {
                        var tok = _this.ed.mirror.getTokenAt(sel_rhs);
                        if (tok.type && tok.type.match(/comment/)) {
                            var lhs = _this.lhs(sel_lhs, tok), rhs = _this.rhs(sel_rhs, tok);
                            return _this.ed.mirror
                                .getRange(lhs, rhs).slice(1, -1);
                        }
                        else {
                            return "`" + _this.ed.mirror
                                .getRange(sel_lhs, sel_rhs) + "`";
                        }
                    }
                    else {
                        return _this.ed.mirror
                            .getRange(sel_lhs, sel_rhs);
                    }
                }), 'around');
            }
            else {
                var cur = this.ed.mirror.getCursor(), mod = this.ed.mirror.getModeAt(cur);
                if (mod && mod.name === 'markdown') {
                    var tok = this.ed.mirror.getTokenAt(cur);
                    if (tok.type && tok.type.match(/comment/)) {
                        var lhs = this.lhs(cur, tok), rhs = this.rhs(cur, tok);
                        var src = this.ed.mirror.getRange(lhs, rhs), tgt = src.slice(1, -1);
                        this.ed.mirror.replaceRange(tgt, lhs, rhs);
                        this.ed.mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 2
                        });
                    }
                    else {
                        this.ed.mirror.replaceRange('` `', cur);
                        this.ed.mirror.setSelection({
                            line: cur.line, ch: cur.ch + 1
                        }, {
                            line: cur.line, ch: cur.ch + 2
                        });
                    }
                }
            }
        };
        MdEditorToolbar.prototype.onCommentClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd;
            var px_1 = val.substring(0, beg), ix_1 = val.substring(beg, end), sx_1 = val.substring(end, val.length);
            var px_2 = val.substring(0, beg - 1), ix_2 = val.substring(beg - 1, end + 1), sx_2 = val.substring(end + 1, val.length);
            var rx_1 = /^`([^`]+)`$/, mm_1 = ix_1.match(rx_1);
            var rx_2 = /^`([^`]+)`$/, mm_2 = ix_2.match(rx_2);
            if (mm_1 && mm_1.length > 1) {
                if (!document.execCommand('insertText', false, mm_1[1])) {
                    this.ed.$input.val("" + px_1 + mm_1[1] + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end - 2);
            }
            else if (mm_2 && mm_2.length > 1) {
                this.ed.$input[0].setSelectionRange(beg - 1, end + 1);
                if (!document.execCommand('insertText', false, mm_2[1])) {
                    this.ed.$input.val("" + px_2 + mm_2[1] + sx_2);
                }
                this.ed.$input[0].setSelectionRange(beg - 1, end - 1);
            }
            else {
                if (!document.execCommand('insertText', false, "`" + ix_1 + "`")) {
                    this.ed.$input.val(px_1 + "`" + ix_1 + "`" + sx_1);
                }
                this.ed.$input[0].setSelectionRange(beg, end + 2);
            }
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onIndentClick = function () {
            if (this.ed.mirror) {
                this.onIndentClickMirror();
            }
            else {
                this.onIndentClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onIndentClickMirror = function () {
            this.ed.mirror.execCommand('indentMore');
        };
        MdEditorToolbar.prototype.onIndentClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd, idx = beg - 1;
            while (idx >= 0 && val[idx] !== '\n') {
                idx -= 1;
            }
            var px = val.substring(0, idx + 1), sx = val.substring(idx + 1, val.length);
            this.ed.$input[0].setSelectionRange(idx + 1, idx + 1);
            if (!document.execCommand('insertText', false, '  ')) {
                this.ed.$input.val(px + "  " + sx);
            }
            this.ed.$input[0].setSelectionRange(beg + 2, end + 2);
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onOutdentClick = function () {
            if (this.ed.mirror) {
                this.onOutdentClickMirror();
            }
            else {
                this.onOutdentClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onOutdentClickMirror = function () {
            this.ed.mirror.execCommand('indentLess');
        };
        MdEditorToolbar.prototype.onOutdentClickSimple = function () {
            var val = this.ed.$input.val(), beg = this.ed.$input[0].selectionStart, end = this.ed.$input[0].selectionEnd, idx = beg - 1;
            while (idx >= 0 && val[idx] !== '\n') {
                idx -= 1;
            }
            var px = val.substring(0, idx + 1), sx = val.substring(idx + 1, val.length);
            var rx = /^\s{2}/, mm = sx.match(rx);
            if (mm && mm.length > 0) {
                this.ed.$input[0].setSelectionRange(idx + 1, idx + 3);
                if (!document.execCommand('insertText', false, '')) {
                    this.ed.$input.val("" + px + sx.substring(2));
                }
                if (beg > 0 && val[beg - 1] === '\n') {
                    this.ed.$input[0].setSelectionRange(beg, end);
                }
                else {
                    this.ed.$input[0].setSelectionRange(beg - 2, end - 2);
                }
                this.ed.$input.trigger('change');
            }
        };
        MdEditorToolbar.prototype.onSupscriptClick = function () {
            if (this.ed.mirror) {
                this.onSupscriptClickMirror();
            }
            else {
                this.onSupscriptClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onSupscriptClickMirror = function () {
            var cur = this.ed.mirror.getCursor(), mod = this.ed.mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                this.ed.mirror.replaceRange('^{ }', cur);
                this.ed.mirror.setSelection({
                    line: cur.line, ch: cur.ch + 2
                }, {
                    line: cur.line, ch: cur.ch + 3
                });
            }
        };
        MdEditorToolbar.prototype.onSupscriptClickSimple = function () {
            var val = this.ed.$input.val(), end = this.ed.$input[0].selectionEnd;
            this.ed.$input[0].setSelectionRange(end, end);
            if (!document.execCommand('insertText', false, '^{ }')) {
                var px = val.substring(0, end), sx = val.substring(end, val.length);
                this.ed.$input.val(px + "^{ }" + sx);
            }
            this.ed.$input[0].setSelectionRange(end + 2, end + 3);
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.onSubscriptClick = function () {
            if (this.ed.mirror) {
                this.onSubscriptClickMirror();
            }
            else {
                this.onSubscriptClickSimple();
            }
            this.ed.focus();
        };
        MdEditorToolbar.prototype.onSubscriptClickMirror = function () {
            var cur = this.ed.mirror.getCursor(), mod = this.ed.mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                this.ed.mirror.replaceRange('~{ }', cur);
                this.ed.mirror.setSelection({
                    line: cur.line, ch: cur.ch + 2
                }, {
                    line: cur.line, ch: cur.ch + 3
                });
            }
        };
        MdEditorToolbar.prototype.onSubscriptClickSimple = function () {
            var val = this.ed.$input.val(), end = this.ed.$input[0].selectionEnd;
            this.ed.$input[0].setSelectionRange(end, end);
            if (!document.execCommand('insertText', false, '~{ }')) {
                var px = val.substring(0, end), sx = val.substring(end, val.length);
                this.ed.$input.val(px + "~{ }" + sx);
            }
            this.ed.$input[0].setSelectionRange(end + 2, end + 3);
            this.ed.$input.trigger('change');
        };
        MdEditorToolbar.prototype.lhs = function (cursor, token) {
            if (this.ed.mirror) {
                var last = { line: cursor.line, ch: cursor.ch }, next = { line: cursor.line, ch: cursor.ch };
                while (true) {
                    var next_token = this.ed.mirror.getTokenAt(next);
                    if (next_token.type && !next_token.type.match(token.type) ||
                        !next_token.type && next_token.type !== token.type) {
                        return last = {
                            ch: next.ch, line: next.line
                        };
                    }
                    else {
                        last = {
                            ch: next.ch, line: next.line
                        };
                    }
                    if (next.ch > 0) {
                        next.ch -= 1;
                    }
                    else {
                        if (next.line > 0) {
                            next.line -= 1;
                            next.ch = this.ed.mirror.getLine(next.line).length;
                        }
                        else {
                            return last;
                        }
                    }
                }
            }
            else {
                return null;
            }
        };
        MdEditorToolbar.prototype.rhs = function (cursor, token) {
            if (this.ed.mirror) {
                var last = { line: cursor.line, ch: cursor.ch }, next = { line: cursor.line, ch: cursor.ch };
                while (true) {
                    var next_token = this.ed.mirror.getTokenAt(next);
                    if (next_token.type && !next_token.type.match(token.type) ||
                        !next_token.type && next_token.type !== token.type) {
                        return last;
                    }
                    else {
                        last = {
                            ch: next.ch, line: next.line
                        };
                    }
                    if (next.ch < this.ed.mirror.getLine(next.line).length) {
                        next.ch += 1;
                    }
                    else {
                        if (next.line < this.ed.mirror.lineCount()) {
                            next.line += 1;
                            next.ch = this.ed.mirror.getLine(next.line).length;
                        }
                        else {
                            return last;
                        }
                    }
                }
            }
            else {
                return null;
            }
        };
        Object.defineProperty(MdEditorToolbar.prototype, "$outer", {
            get: function () {
                return $('.md-toolbar-outer');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$toolbar", {
            get: function () {
                return $('.md-toolbar');
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(MdEditorToolbar.prototype, "$indent", {
            get: function () {
                return $('.glyphicon-indent-left').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$outdent", {
            get: function () {
                return $('.glyphicon-indent-right').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$supscript", {
            get: function () {
                return $('.glyphicon-superscript').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "$subscript", {
            get: function () {
                return $('.glyphicon-subscript').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorToolbar.prototype, "scroll", {
            get: function () {
                if (this._scroll === undefined) {
                    this._scroll = new IScroll('.md-toolbar-inner', {
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
        Object.defineProperty(MdEditorToolbar.prototype, "ed", {
            get: function () {
                return md_editor_1.default.me;
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