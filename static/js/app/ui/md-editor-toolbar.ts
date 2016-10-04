///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {named} from "../decorator/named";
import {trace} from "../decorator/trace";

import MdEditor from "./md-editor";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditorToolbar')
export class MdEditorToolbar {
    public static get me(): MdEditorToolbar {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_TOOLBAR'] = new MdEditorToolbar();
        }
        return this['_me'];
    }

    public constructor() {

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
            this.$outer.fadeIn('slow', () => {
                this.$toolbar.find('[data-toggle="tooltip"]').tooltip();
                this.$toolbar.find('[data-toggle="popover"]').popover();
                this.refresh();
            });
        }
    }

    public refresh() {
        this.ed.refresh();
        this.scroll.refresh();
    }

    private onUndoClick() {
        if (this.ed.mirror) {
            this.ed.mirror.execCommand('undo');
        } else {
            try {
                document.execCommand('undo')
            } catch (ex) {
                console.error(ex);
            }
            this.ed.$input.trigger('change');
        }
        this.ed.focus();
    }

    private onRedoClick() {
        if (this.ed.mirror) {
            this.ed.mirror.execCommand('redo');
        } else {
            try {
                document.execCommand('redo')
            } catch (ex) {
                console.error(ex);
            }
            this.ed.$input.trigger('change');
        }
        this.ed.focus();
    }

    private onCutClick() {
        this.clipboard = this.ed.getSelection();
        if (this.ed.mirror) {
            this.ed.mirror.replaceSelection('');
        } else {
            try {
                document.execCommand('cut')
            } catch (ex) {
                console.error(ex);
            }
            this.ed.$input.trigger('change');
        }
        this.ed.focus();
    }

    private onCopyClick() {
        this.clipboard = this.ed.getSelection();
        try {
            document.execCommand('copy');
        } catch (ex) {
            console.error(ex);
        }
        this.ed.focus();
    }

    private onPasteClick() {
        if (this.ed.mirror) {
            this.ed.mirror.replaceSelection(this.clipboard);
        } else {
            try {
                document.execCommand('insertText', false, this.clipboard);
            } catch (ex) {
                console.error(ex);
            }
            this.ed.$input.trigger('change');
        }
        this.ed.focus();
    }

    private onEraseClick() {
        if (this.ed.mirror) {
            this.ed.mirror.replaceSelection('');
        } else {
            try {
                document.execCommand('insertText', false, '');
            } catch (ex) {
                console.error(ex);
            }
            this.ed.$input.trigger('change');
        }
        this.ed.focus();
    }

    private onHeaderClick() {
        if (this.ed.mirror) {
            this.onHeaderClickMirror();
        } else {
            this.onHeaderClickSimple();
        }
        this.ed.focus();
    }

    private onHeaderClickMirror() {
        let cursor = this.ed.mirror.getCursor(),
            curr_from = {line: cursor.line, ch: 0},
            next_from = {line: cursor.line + 1, ch: 0};
        let curr_ts = this.ed.mirror.getLineTokens(curr_from.line),
            next_ts = this.ed.mirror.getLineTokens(next_from.line);
        let line = this.ed.mirror.getLineHandle(curr_from.line),
            mode = this.ed.mirror.getModeAt(curr_from);
        let suffix = line.text.match(/^\s+/) ? '' : ' ',
            prefix = '#';

        let hs = curr_ts.filter((tok) => {
            return tok && tok.type && tok.type.match(/header/);
        });
        let h1s = line.text.match(/^\s*=/) && curr_ts.filter((tok) => {
            return tok && tok.type && tok.type.match(/header-1/) &&
                   tok.string === '=';
        });
        let h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter((tok) => {
            return tok && tok.type && tok.type.match(/header-2/) &&
                   tok.string === '-';
        });
        let h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter((tok) => {
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
            } else {
                if (next_ts.length > 0) {
                    let next_tok = next_ts[next_ts.length - 1];
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
    }

    private onHeaderClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd,
            idx = beg;

        while (idx-- > 0) {
            if (val[idx] === '\n') {
                break;
            }
        }

        let px = val.substring(0, idx + 1),
            sx = val.substring(idx + 1, val.length);

        let rx_6 =/^\s*#{6,}\s*/,
            mm_6 = sx.match(rx_6);
        let rx_5 =/^\s*#{1,5}/,
            mm_5 = sx.match(rx_5);
        let rx_0 =/^\s*#{0}/,
            mm_0 = sx.match(rx_0);

        if (mm_6 && mm_6.length > 0) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                idx + 1, idx + mm_6[0].length + 1);
            if (!document.execCommand('insertText', false, '')) {
                this.ed.$input.val(
                    `${px}${sx.replace(rx_6, '')}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                beg - mm_6[0].length, end - mm_6[0].length);
        } else if (mm_5 && mm_5.length > 0) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                idx + 1, idx + mm_5[0].length + 1);
            if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                this.ed.$input.val(
                    `${px}${sx.replace(rx_5, mm_5[0] + '#')}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                beg + 1, end + 1);
        } else if (mm_0 && mm_0.length > 0) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                idx + 1, idx + mm_0[0].length + 1);
            if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                this.ed.$input.val(
                    `${px}${sx.replace(rx_0, '# ' + mm_0[0])}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(
                beg + mm_0[0].length + 2, end + mm_0[0].length + 2);
        }
        this.ed.$input.trigger('change');
    }

    private onBoldClick() {
        if (this.ed.mirror) {
            this.onBoldClickMirror();
        } else {
            this.onBoldClickSimple();
        }
        this.ed.focus();
    }

    private onBoldClickMirror() {
        let selections = this.ed.mirror.listSelections();
        if (selections.length > 0 && this.ed.mirror.getSelection()) {
            this.ed.mirror.setSelections(selections.map((sel) => {
                let lhs_mod = this.ed.mirror.getModeAt(sel.head),
                    rhs_mod = this.ed.mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown') {
                    let tok = this.ed.mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        return {
                            anchor: this.lhs(sel.anchor, tok),
                            head: this.rhs(sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            this.ed.mirror.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch) {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.ed.mirror.getModeAt(sel_lhs),
                    mod_rhs = this.ed.mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown') {
                    let tok = this.ed.mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        if (tok.type.match(/em/)) {
                            return `*${this.ed.mirror
                                .getRange(lhs, rhs)}*`;
                        } else {
                            return this.ed.mirror
                                .getRange(lhs, rhs).slice(2, -2);
                        }
                    } else {
                        return `**${this.ed.mirror
                            .getRange(sel_lhs, sel_rhs)}**`;
                    }
                } else {
                    return this.ed.mirror
                        .getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.ed.mirror.getCursor(),
                mod = this.ed.mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.ed.mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)) {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    if (tok.type.match(/em/)) {
                        let src = this.ed.mirror.getRange(lhs, rhs),
                            tgt = `*${src}*`;
                        this.ed.mirror.replaceRange(tgt, lhs, rhs);
                        this.ed.mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch + 2
                        });
                    } else {
                        let src = this.ed.mirror.getRange(lhs, rhs),
                            tgt = src.slice(2, -2);
                        this.ed.mirror.replaceRange(tgt, lhs, rhs);
                        this.ed.mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 4
                        });
                    }
                } else {
                    this.ed.mirror.replaceRange('****', cur);
                    this.ed.mirror.setCursor({
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }

    private onBoldClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd;

        let px_1 = val.substring(0, beg),
            ix_1 = val.substring(beg, end),
            sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 2),
            ix_2 = val.substring(beg - 2, end + 2),
            sx_2 = val.substring(end + 2, val.length);

        let rx_1 =/^\*\*((?:(?!\*\*).)+)\*\*$/,
            mm_1 = ix_1.match(rx_1);
        let rx_2 =/^\*\*((?:(?!\*\*).)+)\*\*$/,
            mm_2 = ix_2.match(rx_2);

        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end - 4);
        } else if (mm_2 && mm_2.length > 1) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 2, end + 2);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 2, end - 2);
        } else {
            if (!document.execCommand('insertText', false, `**${ix_1}**`)) {
                this.ed.$input.val(`${px_1}**${ix_1}**${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end + 4);
        }
        this.ed.$input.trigger('change');
    }

    private onItalicClick() {
        if (this.ed.mirror) {
            this.onItalicClickMirror();
        } else {
            this.onItalicClickSimple();
        }
        this.ed.focus();
    }

    private onItalicClickMirror() {
        let selections = this.ed.mirror.listSelections();
        if (selections.length > 0 && this.ed.mirror.getSelection()) {
            this.ed.mirror.setSelections(selections.map((sel) => {
                let lhs_mod = this.ed.mirror.getModeAt(sel.head),
                    rhs_mod = this.ed.mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown')
                {
                    let tok = this.ed.mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/))
                    {
                        return {
                            anchor: this.lhs(sel.anchor, tok),
                            head: this.rhs(sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            this.ed.mirror.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch)
                {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.ed.mirror.getModeAt(sel_lhs),
                    mod_rhs = this.ed.mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown')
                {
                    let tok = this.ed.mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        return this.ed.mirror
                            .getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `*${this.ed.mirror
                            .getRange(sel_lhs, sel_rhs)}*`;
                    }
                } else {
                    return this.ed.mirror
                        .getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.ed.mirror.getCursor(),
                mod = this.ed.mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.ed.mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/))
                {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    let src = this.ed.mirror.getRange(lhs, rhs),
                        tgt = src.slice(1, -1);
                    this.ed.mirror.replaceRange(tgt, lhs, rhs);
                    this.ed.mirror.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    this.ed.mirror.replaceRange('* *', cur);
                    this.ed.mirror.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }

    private onItalicClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd;

        let px_1 = val.substring(0, beg),
            ix_1 = val.substring(beg, end),
            sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 1),
            ix_2 = val.substring(beg - 1, end + 1),
            sx_2 = val.substring(end + 1, val.length);

        let rx_1 =/^\*([^*]+)\*$/,
            mm_1 = ix_1.match(rx_1);
        let rx_2 =/^\*([^*]+)\*$/,
            mm_2 = ix_2.match(rx_2);

        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `*${ix_1}*`)) {
                this.ed.$input.val(`${px_1}*${ix_1}*${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end + 2);
        }
        this.ed.$input.trigger('change');
    }

    private onCommentClick() {
        if (this.ed.mirror) {
            this.onCommentClickMirror();
        } else {
            this.onCommentClickSimple();
        }
        this.ed.focus();
    }

    private onCommentClickMirror() {
        let selections = this.ed.mirror.listSelections();
        if (selections.length > 0 && this.ed.mirror.getSelection()) {
            this.ed.mirror.setSelections(selections.map((sel) => {
                let lhs_mod = this.ed.mirror.getModeAt(sel.head),
                    rhs_mod = this.ed.mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown')
                {
                    let tok = this.ed.mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/comment/))
                    {
                        return {
                            anchor: this.lhs(sel.anchor, tok),
                            head: this.rhs(sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            this.ed.mirror.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch)
                {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.ed.mirror.getModeAt(sel_lhs),
                    mod_rhs = this.ed.mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown')
                {
                    let tok = this.ed.mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/comment/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        return this.ed.mirror
                            .getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `\`${this.ed.mirror
                            .getRange(sel_lhs, sel_rhs)}\``;
                    }
                } else {
                    return this.ed.mirror
                        .getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.ed.mirror.getCursor(),
                mod = this.ed.mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.ed.mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/comment/))
                {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    let src = this.ed.mirror.getRange(lhs, rhs),
                        tgt = src.slice(1, -1);
                    this.ed.mirror.replaceRange(tgt, lhs, rhs);
                    this.ed.mirror.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    this.ed.mirror.replaceRange('` `', cur);
                    this.ed.mirror.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }

    private onCommentClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd;

        let px_1 = val.substring(0, beg),
            ix_1 = val.substring(beg, end),
            sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 1),
            ix_2 = val.substring(beg - 1, end + 1),
            sx_2 = val.substring(end + 1, val.length);

        let rx_1 =/^`([^`]+)`$/,
            mm_1 = ix_1.match(rx_1);
        let rx_2 =/^`([^`]+)`$/,
            mm_2 = ix_2.match(rx_2);

        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `\`${ix_1}\``)) {
                this.ed.$input.val(`${px_1}\`${ix_1}\`${sx_1}`);
            }
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end + 2);
        }
        this.ed.$input.trigger('change');
    }

    private onIndentClick() {
        if (this.ed.mirror) {
            this.onIndentClickMirror();
        } else {
            this.onIndentClickSimple();
        }
        this.ed.focus();
    }

    private onIndentClickMirror() {
        this.ed.mirror.execCommand('indentMore');
    }

    private onIndentClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd,
            idx = beg - 1;

        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }

        let px = val.substring(0, idx + 1),
            sx = val.substring(idx + 1, val.length);

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(idx + 1, idx + 1);
        if (!document.execCommand('insertText', false, '  ')) {
            this.ed.$input.val(`${px}  ${sx}`);
        }

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg + 2, end + 2);
        this.ed.$input.trigger('change');
    }

    private onOutdentClick() {
        if (this.ed.mirror) {
            this.onOutdentClickMirror();
        } else {
            this.onOutdentClickSimple();
        }
        this.ed.focus();
    }

    private onOutdentClickMirror() {
        this.ed.mirror.execCommand('indentLess');
    }

    private onOutdentClickSimple() {
        let val:string = this.ed.$input.val(),
            beg = (this.ed.$input[0] as HTMLInputElement).selectionStart,
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd,
            idx = beg - 1;

        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }

        let px = val.substring(0, idx + 1),
            sx = val.substring(idx + 1, val.length);

        let rx =/^\s{2}/,
            mm = sx.match(rx);
        if (mm && mm.length > 0) {
            (this.ed.$input[0] as HTMLInputElement).setSelectionRange(idx + 1, idx + 3);
            if (!document.execCommand('insertText', false, '')) {
                this.ed.$input.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg, end);
            } else {
                (this.ed.$input[0] as HTMLInputElement).setSelectionRange(beg - 2, end - 2);
            }
            this.ed.$input.trigger('change');
        }
    }

    private onSupscriptClick() {
        if (this.ed.mirror) {
            this.onSupscriptClickMirror();
        } else {
            this.onSupscriptClickSimple();
        }
        this.ed.focus();
    }

    private onSupscriptClickMirror() {
        let cur = this.ed.mirror.getCursor(),
            mod = this.ed.mirror.getModeAt(cur);
        if (mod && mod.name === 'markdown') {
            this.ed.mirror.replaceRange('^{ }', cur);
            this.ed.mirror.setSelection({
                line: cur.line, ch: cur.ch + 2
            }, {
                line: cur.line, ch: cur.ch + 3
            });
        }
    }

    private onSupscriptClickSimple() {
        let val:string = this.ed.$input.val(),
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd;

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(end, end);
        if (!document.execCommand('insertText', false, '^{ }')) {
            let px = val.substring(0, end),
                sx = val.substring(end, val.length);

            this.ed.$input.val(`${px}^{ }${sx}`);
        }

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(end + 2, end + 3);
        this.ed.$input.trigger('change');
    }

    private onSubscriptClick() {
        if (this.ed.mirror) {
            this.onSubscriptClickMirror();
        } else {
            this.onSubscriptClickSimple();
        }
        this.ed.focus();
    }

    private onSubscriptClickMirror() {
        let cur = this.ed.mirror.getCursor(),
            mod = this.ed.mirror.getModeAt(cur);
        if (mod && mod.name === 'markdown') {
            this.ed.mirror.replaceRange('~{ }', cur);
            this.ed.mirror.setSelection({
                line: cur.line, ch: cur.ch + 2
            }, {
                line: cur.line, ch: cur.ch + 3
            });
        }
    }

    private onSubscriptClickSimple() {
        let val:string = this.ed.$input.val(),
            end = (this.ed.$input[0] as HTMLInputElement).selectionEnd;

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(end, end);
        if (!document.execCommand('insertText', false, '~{ }')) {
            let px = val.substring(0, end),
                sx = val.substring(end, val.length);

            this.ed.$input.val(`${px}~{ }${sx}`);
        }

        (this.ed.$input[0] as HTMLInputElement).setSelectionRange(end + 2, end + 3);
        this.ed.$input.trigger('change');
    }

    private lhs(cursor, token): {ch: number, line: number} {
        if (this.ed.mirror) {
            let last = {line: cursor.line, ch: cursor.ch},
                next = {line: cursor.line, ch: cursor.ch};
            while (true) {
                let next_token = this.ed.mirror.getTokenAt(next);
                if (next_token.type && !next_token.type.match(token.type) ||
                    !next_token.type && next_token.type !== token.type)
                {
                    return last = {
                        ch: next.ch, line: next.line
                    };
                } else {
                    last = {
                        ch: next.ch, line: next.line
                    };
                }
                if (next.ch > 0) {
                    next.ch -= 1;
                } else {
                    if (next.line > 0) {
                        next.line -= 1;
                        next.ch = this.ed.mirror.getLine(
                            next.line
                        ).length;
                    } else {
                        return last;
                    }
                }
            }
        } else {
            return null;
        }
    }

    private rhs(cursor, token): {ch: number, line: number} {
        if (this.ed.mirror) {
            let last = {line: cursor.line, ch: cursor.ch},
                next = {line: cursor.line, ch: cursor.ch};
            while (true) {
                let next_token = this.ed.mirror.getTokenAt(next);
                if (next_token.type && !next_token.type.match(token.type) ||
                    !next_token.type && next_token.type !== token.type)
                {
                    return last;
                } else {
                    last = {
                        ch: next.ch, line: next.line
                    };
                }
                if (next.ch < this.ed.mirror.getLine(next.line).length) {
                    next.ch += 1;
                } else {
                    if (next.line < this.ed.mirror.lineCount()) {
                        next.line += 1;
                        next.ch = this.ed.mirror.getLine(
                            next.line
                        ).length;
                    } else {
                        return last;
                    }
                }
            }
        } else {
            return null;
        }
    }

    private get $outer() {
        return $('.lhs>.toolbar-outer');
    }

    private get $inner() {
        return this.$outer.find('>.toolbar-inner');
    }

    private get $toolbar() {
        return this.$inner.find('>.md-toolbar');
    }

    private get $undo() {
        return $('.glyphicon.undo').closest('button');
    }

    private get $redo() {
        return $('.glyphicon.redo').closest('button');
    }

    private get $cut() {
        return $('.glyphicon-scissors').closest('button');
    }

    private get $copy() {
        return $('.glyphicon-copy').closest('button');
    }

    private get $paste() {
        return $('.glyphicon-paste').closest('button');
    }

    private get $erase() {
        return $('.glyphicon-erase').closest('button');
    }

    private get $header() {
        return $('.glyphicon-header').closest('button');
    }

    private get $bold() {
        return $('.glyphicon-bold').closest('button');
    }

    private get $italic() {
        return $('.glyphicon-italic').closest('button');
    }

    private get $font() {
        return $('.glyphicon-font').closest('button');
    }

    private get $indent() {
        return $('.glyphicon-indent-left').closest('button');
    }

    private get $outdent() {
        return $('.glyphicon-indent-right').closest('button');
    }

    private get $supscript() {
        return $('.glyphicon-superscript').closest('button');
    }

    private get $subscript() {
        return $('.glyphicon-subscript').closest('button');
    }

    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll('.toolbar-inner', {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }

    private get ed() {
        return MdEditor.me;
    }

    private get clipboard(): string {
        if (this._clipboard === undefined) {
            this._clipboard = '';
        }
        return this._clipboard;
    }

    private set clipboard(value: string) {
        this._clipboard = value;
    }

    private _clipboard: string; //@TODO: [I]Clipboard?
    private _scroll: any;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorToolbar;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
