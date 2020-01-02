import { trace } from "../decorator/trace";
import { MdEditor } from "./md-editor";

declare const $: JQueryStatic;

@trace
export class MdEditorToolbar {
    public static get me(this: any): MdEditorToolbar {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_TOOLBAR'] = new MdEditorToolbar();
        }
        return this['_me'];
    }
    public constructor() {
        this.$publish
            .on('click', this.onPublishClick.bind(this));
        this.$print
            .on('click', this.onPrintClick.bind(this));
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
        this.$link
            .on('click', this.onLinkClick.bind(this));
        this.$indent
            .on('click', this.onIndentClick.bind(this));
        this.$outdent
            .on('click', this.onOutdentClick.bind(this));
        this.$sum
            .on('click', this.onSumClick.bind(this));
        this.$product
            .on('click', this.onProductClick.bind(this));
        this.$supscript
            .on('click', this.onSupscriptClick.bind(this));
        this.$subscript
            .on('click', this.onSubscriptClick.bind(this));
        this.$refresh
            .on('click', this.onRefreshClick.bind(this));
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
    private onRefreshClick() {
        this.ed.render(true);
    }
    private onPublishClick() {
        $('#publish-dlg').modal();
    }
    private onPrintClick() {
        window.print();
    }
    private onUndoClick() {
        let mirror = this.ed.mirror;
        if (mirror) {
            mirror.execCommand('undo');
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
        let mirror = this.ed.mirror;
        if (mirror) {
            mirror.execCommand('redo');
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
        let { value } = this.ed.getSelection();
        this.clipboard = value;
        let mirror = this.ed.mirror;
        if (mirror) {
            mirror.replaceSelection('');
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
        let { value } = this.ed.getSelection();
        this.clipboard = value;
        try {
            document.execCommand('copy');
        } catch (ex) {
            console.error(ex);
        }
        this.ed.focus();
    }
    private onPasteClick() {
        let mirror = this.ed.mirror;
        if (mirror) {
            mirror.replaceSelection(this.clipboard);
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
        let mirror = this.ed.mirror;
        if (mirror) {
            mirror.replaceSelection('');
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
            this.onHeaderClickMirror(this.ed.mirror);
        } else {
            this.onHeaderClickSimple();
        }
        this.ed.focus();
    }
    private onHeaderClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let cursor = mirror.getCursor();
        let curr_from = { line: cursor.line, ch: 0 };
        let next_from = { line: cursor.line + 1, ch: 0 };
        let curr_ts = mirror.getLineTokens(curr_from.line);
        let next_ts = mirror.getLineTokens(next_from.line);
        let line = mirror.getLineHandle(curr_from.line);
        let mode = mirror.getModeAt(curr_from);
        let suffix = line.text.match(/^\s+/) ? '' : ' ';
        let prefix = '#';
        let hs = curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header/);
        });
        let h1s = line.text.match(/^\s*=/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-1/) &&
                tok.string === '=';
        });
        let h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-2/) &&
                tok.string === '-';
        });
        let h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-6/) &&
                tok.string === '#';
        });
        if (mode && mode.name === 'markdown') {
            if (hs && hs.length > 0) {
                if (h1s && h1s.length > 0) {
                    mirror.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    mirror.replaceRange('#' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    mirror.setCursor({
                        ch: 3, line: curr_from.line - 1
                    });
                }
                else if (h2s && h2s.length > 0) {
                    mirror.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    mirror.replaceRange('##' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    mirror.setCursor({
                        ch: 4, line: curr_from.line - 1
                    });
                }
                else if (h6s && h6s.length > 0) {
                    let match = line.text.match(/\s*#{6}\s*/);
                    if (match) {
                        mirror.replaceRange('', curr_from, {
                            ch: match.toString().length,
                            line: curr_from.line,
                        });
                    }
                }
                else {
                    mirror.replaceRange(prefix, {
                        ch: hs[0].start, line: curr_from.line
                    });
                }
            } else {
                if (next_ts.length > 0) {
                    let next_tok = next_ts[next_ts.length - 1];
                    if (next_tok.type && next_tok.type.match(/^header/)) {
                        if (next_tok.string === '=' &&
                            next_tok.type.match(/header-1$/)) {
                            mirror.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '#';
                        }
                        if (next_tok.string === '-' &&
                            next_tok.type.match(/header-2$/)) {
                            mirror.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '##';
                        }
                    }
                }
                mirror.replaceRange(prefix + suffix, curr_from);
            }
        }
    }
    private onHeaderClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let idx = beg as number;
        while (idx-- > 0) {
            if (val[idx] === '\n') {
                break;
            }
        }
        let px = val.substring(0, idx + 1);
        let sx = val.substring(idx + 1, val.length);
        let rx_6 = /^\s*#{6,}\s*/;
        let mm_6 = sx.match(rx_6);
        let rx_5 = /^\s*#{1,5}/;
        let mm_5 = sx.match(rx_5);
        let rx_0 = /^\s*#{0}/;
        let mm_0 = sx.match(rx_0);
        if (mm_6 && mm_6.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_6[0].length + 1
            );
            if (!document.execCommand('insertText', false, '')) {
                this.ed.$input.val(`${px}${sx.replace(rx_6, '')}`);
            }
            inp.setSelectionRange(
                beg - mm_6[0].length, end - mm_6[0].length
            );
        } else if (mm_5 && mm_5.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_5[0].length + 1
            );
            if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                this.ed.$input.val(`${px}${sx.replace(rx_5, mm_5[0] + '#')}`);
            }
            inp.setSelectionRange(
                beg + 1, end + 1
            );
        } else if (mm_0 && mm_0.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_0[0].length + 1
            );
            if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                this.ed.$input.val(`${px}${sx.replace(rx_0, '# ' + mm_0[0])}`);
            }
            inp.setSelectionRange(
                beg + mm_0[0].length + 2, end + mm_0[0].length + 2
            );
        }
        this.ed.$input.trigger('change');
    }
    private onBoldClick() {
        if (this.ed.mirror) {
            this.onBoldClickMirror(this.ed.mirror);
        } else {
            this.onBoldClickSimple();
        }
        this.ed.focus();
    }

    private onBoldClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                let lhs_mod = mirror.getModeAt(sel.head);
                let rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        return {
                            anchor: this.lhs(mirror, sel.anchor, tok),
                            head: this.rhs(mirror, sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            (mirror as any).replaceSelections(selections.map((sel: any) => {
                let sel_lhs = sel.anchor;
                let sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch
                ) {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = mirror.getModeAt(sel_lhs);
                let mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        let lhs = this.lhs(mirror, sel_lhs, tok);
                        let rhs = this.rhs(mirror, sel_rhs, tok);
                        if (tok.type.match(/em/)) {
                            return `*${mirror.getRange(lhs, rhs)}*`;
                        } else {
                            return mirror.getRange(lhs, rhs).slice(2, -2);
                        }
                    } else {
                        return `**${mirror.getRange(sel_lhs, sel_rhs)}**`;
                    }
                } else {
                    return mirror.getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = mirror.getCursor();
            let mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)
                ) {
                    let lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    let rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    if (tok.type.match(/em/)) {
                        let src = mirror.getRange(lhs, rhs);
                        let tgt = `*${src}*`;
                        mirror.replaceRange(tgt, lhs, rhs);
                        mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch + 2
                        });
                    } else {
                        let src = mirror.getRange(lhs, rhs);
                        let tgt = src.slice(2, -2);
                        mirror.replaceRange(tgt, lhs, rhs);
                        mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 4
                        });
                    }
                } else {
                    mirror.replaceRange('****', cur);
                    mirror.setCursor({
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }
    private onBoldClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let px_1 = val.substring(0, beg);
        let ix_1 = val.substring(beg, end);
        let sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 2);
        let ix_2 = val.substring(beg - 2, end + 2);
        let sx_2 = val.substring(end + 2, val.length);
        let rx_1 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        let mm_1 = ix_1.match(rx_1);
        let rx_2 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        let mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 4);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 2, end + 2);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 2, end - 2);
        } else {
            if (!document.execCommand('insertText', false, `**${ix_1}**`)) {
                this.ed.$input.val(`${px_1}**${ix_1}**${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 4);
        }
        this.ed.$input.trigger('change');
    }
    private onItalicClick() {
        if (this.ed.mirror) {
            this.onItalicClickMirror(this.ed.mirror);
        } else {
            this.onItalicClickSimple();
        }
        this.ed.focus();
    }
    private onItalicClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                let lhs_mod = mirror.getModeAt(sel.head);
                let rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        return {
                            anchor: this.lhs(mirror, sel.anchor, tok),
                            head: this.rhs(mirror, sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            (mirror as any).replaceSelections(selections.map((sel: any) => {
                let sel_lhs = sel.anchor;
                let sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch
                ) {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = mirror.getModeAt(sel_lhs);
                let mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        let lhs = this.lhs(mirror, sel_lhs, tok);
                        let rhs = this.rhs(mirror, sel_rhs, tok);
                        return mirror
                            .getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `*${mirror
                            .getRange(sel_lhs, sel_rhs)}*`;
                    }
                } else {
                    return mirror
                        .getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = mirror.getCursor();
            let mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)
                ) {
                    let lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    let rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    let src = mirror.getRange(lhs, rhs);
                    let tgt = src.slice(1, -1);
                    mirror.replaceRange(tgt, lhs, rhs);
                    mirror.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    mirror.replaceRange('* *', cur);
                    mirror.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }
    private onItalicClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let px_1 = val.substring(0, beg);
        let ix_1 = val.substring(beg, end);
        let sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 1);
        let ix_2 = val.substring(beg - 1, end + 1);
        let sx_2 = val.substring(end + 1, val.length);
        let rx_1 = /^\*([^*]+)\*$/;
        let mm_1 = ix_1.match(rx_1);
        let rx_2 = /^\*([^*]+)\*$/;
        let mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `*${ix_1}*`)) {
                this.ed.$input.val(`${px_1}*${ix_1}*${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.ed.$input.trigger('change');
    }
    private onCommentClick() {
        if (this.ed.mirror) {
            this.onCommentClickMirror(this.ed.mirror);
        } else {
            this.onCommentClickSimple();
        }
        this.ed.focus();
    }
    private onCommentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                let lhs_mod = mirror.getModeAt(sel.head);
                let rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel.head);
                    if (tok.type && tok.type.match(/comment/)) {
                        return {
                            anchor: this.lhs(mirror, sel.anchor, tok),
                            head: this.rhs(mirror, sel.head, tok)
                        };
                    } else {
                        return sel;
                    }
                } else {
                    return sel;
                }
            }));
            (mirror as any).replaceSelections(selections.map((sel: any) => {
                let sel_lhs = sel.anchor;
                let sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch
                ) {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = mirror.getModeAt(sel_lhs);
                let mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    let tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/comment/)) {
                        let lhs = this.lhs(mirror, sel_lhs, tok);
                        let rhs = this.rhs(mirror, sel_rhs, tok);
                        return mirror
                            .getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `\`${mirror
                            .getRange(sel_lhs, sel_rhs)}\``;
                    }
                } else {
                    return mirror
                        .getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = mirror.getCursor();
            let mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/comment/)) {
                    let lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    let rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    let src = mirror.getRange(lhs, rhs);
                    let tgt = src.slice(1, -1);
                    mirror.replaceRange(tgt, lhs, rhs);
                    mirror.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    mirror.replaceRange('` `', cur);
                    mirror.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }
    }
    private onCommentClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let px_1 = val.substring(0, beg);
        let ix_1 = val.substring(beg, end);
        let sx_1 = val.substring(end, val.length);
        let px_2 = val.substring(0, beg - 1);
        let ix_2 = val.substring(beg - 1, end + 1);
        let sx_2 = val.substring(end + 1, val.length);
        let rx_1 = /^`([^`]+)`$/;
        let mm_1 = ix_1.match(rx_1);
        let rx_2 = /^`([^`]+)`$/;
        let mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.ed.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ed.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `\`${ix_1}\``)) {
                this.ed.$input.val(`${px_1}\`${ix_1}\`${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.ed.$input.trigger('change');
    }
    private onIndentClick() {
        if (this.ed.mirror) {
            this.onIndentClickMirror(this.ed.mirror);
        } else {
            this.onIndentClickSimple();
        }
        this.ed.focus();
    }
    private onIndentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentMore');
    }
    private onIndentClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        let px = val.substring(0, idx + 1);
        let sx = val.substring(idx + 1, val.length);
        inp.setSelectionRange(idx + 1, idx + 1);
        if (!document.execCommand('insertText', false, '  ')) {
            this.ed.$input.val(`${px}  ${sx}`);
        }
        inp.setSelectionRange(beg + 2, end + 2);
        this.ed.$input.trigger('change');
    }
    private onLinkClick(ev: JQuery.Event) {
        if (this.ed.mirror) {
            this.onLinkClickMirror(this.ed.mirror,
                Boolean(ev.ctrlKey), Boolean(ev.shiftKey)
            );
        } else {
            this.onLinkClickSimple(
                Boolean(ev.ctrlKey), Boolean(ev.shiftKey)
            );
        }
        this.ed.focus();
    }
    private onLinkClickMirror(
        mirror: CodeMirror.Editor,
        ctrl: boolean, shift: boolean
    ) {
        let beg_cur = mirror.getCursor('from');
        let beg_mod = mirror.getModeAt(beg_cur);
        let end_cur = mirror.getCursor('to');
        let end_mod = mirror.getModeAt(end_cur);
        let val = mirror.getValue().trimRight();
        let sel = mirror.getSelection();
        let set_text = (beg: any, end: any) => (
            value: string | null, range: string
        ) => {
            if (value) mirror.setValue(value);
            mirror.replaceRange(range, beg, end);
        };
        let sel_text = (beg: any, end?: any) => (
            beg_dif: number, end_dif: number,
            beg_alt?: any, end_lat?: any
        ) => {
            mirror.setSelection({
                ...{ line: (beg||end).line, ch: (beg||end).ch + beg_dif },
                ...{ ...(beg_alt||end_lat) }
            }, {
                ...{ line: (end||beg).line, ch: (end||beg).ch + end_dif },
                ...{ ...(end_lat||beg_alt) }
            });
        };
        if (beg_mod && beg_mod.name === 'markdown' &&
            end_mod && end_mod.name === 'markdown'
        ) {
            if (ctrl && shift) {
                set_text(beg_cur, end_cur)(
                    `${val} \n\n[${sel||'TEXT'}]: URL\n`, `[${sel||'TEXT'}]`
                );
                sel.length ? sel_text(beg_cur)(0, 0, {
                    line: mirror.lastLine() - 1, ch: sel.length + 4
                }, {
                    line: mirror.lastLine() - 1, ch: sel.length + 7
                }) : sel_text(beg_cur)(1, 5);
            } else if (ctrl) {
                set_text(beg_cur, end_cur)(
                    `${val} \n\n[REF]: URL\n`, `[${sel||'TEXT'}][REF]`
                );
                sel.length
                    ? sel_text(beg_cur)(sel.length + 3, sel.length + 6)
                    : sel_text(beg_cur)(1, 5);
            } else {
                set_text(beg_cur, end_cur)(
                    null, `[${sel||'TEXT'}](URL)`
                );
                sel.length
                    ? sel_text(beg_cur)(sel.length + 3, sel.length + 6)
                    : sel_text(beg_cur)(1, 5);
            }
        }
    }
    private onLinkClickSimple(ctrl: boolean, shift: boolean) {
        const ins_text = (
            $input: JQuery<HTMLElement>
        ) => (
            text: string, beg?: number, end?: number
        ) => {
            if (!document.execCommand(
                'insertText', false, text
            )) {
                let inp = $input[0] as HTMLInputElement;
                if (beg === undefined) {
                    beg = inp.selectionStart as number;
                }
                if (end === undefined) {
                    end = inp.selectionEnd as number;
                }
                let value = $input.val() as string;
                let prefix = value.substring(0, beg);
                let suffix = value.substring(end||beg, value.length);
                $input.val(`${prefix}${text}${suffix}`);
            }
        };
        const add_text = (
            $input: JQuery<HTMLElement>
        ) => (
            text: string
        ) => {
            let val = $input.val() as string;
            let inp = $input[0] as HTMLInputElement;
            inp.setSelectionRange(val.length, val.length);
            if (!document.execCommand(
                'insertText', false, text
            )) {
                $input.val(val + text);
            }
        };
        const get_selection = (
            $input: JQuery<HTMLElement>
        ) => (
            beg?: number, end?: number
        ) => (
            n_beg: number=0, n_end: number=0
        ) => {
            let inp = $input[0] as HTMLInputElement;
            if (beg === undefined) {
                beg = inp.selectionStart as number;
            }
            if (end === undefined) {
                end = inp.selectionEnd as number;
            }
            let value = $input.val() as string;
            return {
                sel: value.substring(beg + n_beg, end + n_end),
                beg: beg + n_beg, end: end + n_end
            }
        };
        const set_selection = (
            $input: JQuery<HTMLElement>
        ) => (
            beg: number, end?: number
        ) => (
            n_beg: number=0, n_end: number=0
        ) => {
            let inp = $input[0] as HTMLInputElement;
            if (end === undefined) {
                inp.setSelectionRange(beg + n_beg, beg + n_end);
            } else {
                inp.setSelectionRange(beg + n_beg, end + n_end);
            }
        };
        let { sel, beg } = get_selection(this.ed.$input)()();
        if (ctrl && shift) {
            ins_text(this.ed.$input)(`[${sel||'TEXT'}]`);
            add_text(this.ed.$input)(`\n\n[${sel||'TEXT'}]: URL\n`);
            if (sel.length) {
                let end = (this.ed.$input.val() as string).length;
                set_selection(this.ed.$input)(end - 7)(-sel.length, 0);
            } else {
                set_selection(this.ed.$input)(beg)(1, 5);
            }
        } else if (ctrl) {
            ins_text(this.ed.$input)(`[${sel||'TEXT'}][REF]`);
            add_text(this.ed.$input)(`\n\n[REF]: URL\n`);
            if (sel.length) {
                set_selection(this.ed.$input)(beg + sel.length)(3, 6);
            } else {
                set_selection(this.ed.$input)(beg)(1, 5);
            }
        } else {
            ins_text(this.ed.$input)(`[${sel||'TEXT'}](URL)`);
            if (sel.length) {
                set_selection(this.ed.$input)(beg + sel.length)(3, 6);
            } else {
                set_selection(this.ed.$input)(beg)(1, 5);
            }
        }
        this.ed.$input.trigger('change');
    }
    private onOutdentClick() {
        if (this.ed.mirror) {
            this.onOutdentClickMirror(this.ed.mirror);
        } else {
            this.onOutdentClickSimple();
        }
        this.ed.focus();
    }
    private onOutdentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentLess');
    }
    private onOutdentClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        let px = val.substring(0, idx + 1);
        let sx = val.substring(idx + 1, val.length);
        let rx = /^\s{2}/;
        let mm = sx.match(rx);
        if (mm && mm.length > 0) {
            inp.setSelectionRange(idx + 1, idx + 3);
            if (!document.execCommand('insertText', false, '')) {
                this.ed.$input.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                inp.setSelectionRange(beg, end);
            } else {
                inp.setSelectionRange(beg - 2, end - 2);
            }
            this.ed.$input.trigger('change');
        }
    }
    private onSumClick(ev: JQuery.Event) {
        if (this.ed.mirror) {
            this.onSumClickMirror(
                this.ed.mirror, Boolean(ev.ctrlKey)
            );
        } else {
            this.onSumClickSimple(Boolean(ev.ctrlKey));
        }
        this.ed.focus();
    }
    private onSumClickMirror(
        mirror: CodeMirror.Editor, flag: boolean
    ) {
        let beg = mirror.getCursor('from');
        let beg_mod = mirror.getModeAt(beg);
        let end = mirror.getCursor('to');
        let end_mod = mirror.getModeAt(end);
        let tex = '\\sum_{i=a}^{b}{i}';
        if (beg_mod && beg_mod.name === 'markdown' &&
            end_mod && end_mod.name === 'markdown'
        ) {
            if (flag) {
                mirror.replaceRange(
                    `\n$$${tex}$$\n`, beg, end
                );
                mirror.setSelection({
                    line: beg.line + 1, ch: 8
                }, {
                    line: beg.line + 1, ch: 11
                });
            } else {
                mirror.replaceRange(
                    `$${tex}$`, beg, end
                );
                mirror.setSelection({
                    line: beg.line, ch: beg.ch + 7
                }, {
                    line: beg.line, ch: beg.ch + 10
                });
            }
        }
    }
    private onSumClickSimple(flag: boolean) {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let tex = '\\sum_{i=a}^{b}{i}';
        inp.setSelectionRange(beg, end);
        if (flag) {
            if (!document.execCommand(
                'insertText', false, `\n$$${tex}$$\n`
            )) {
                let px = val.substring(0, beg);
                let sx = val.substring(end, val.length);
                this.ed.$input.val(`${px}\n$$${tex}$$\n${sx}`);
            }
            inp.setSelectionRange(beg + 9, beg + 12);
        } else {
            if (!document.execCommand(
                'insertText', false, `$${tex}$`
            )) {
                let px = val.substring(0, beg);
                let sx = val.substring(end, val.length);
                this.ed.$input.val(`${px}$${tex}$${sx}`);
            }
            inp.setSelectionRange(beg + 7, beg + 10);
        }
        this.ed.$input.trigger('change');
    }
    private onProductClick(ev: JQuery.Event) {
        if (this.ed.mirror) {
            this.onProductClickMirror(
                this.ed.mirror, Boolean(ev.ctrlKey)
            );
        } else {
            this.onProductClickSimple(
                Boolean(ev.ctrlKey)
            );
        }
        this.ed.focus();
    }
    private onProductClickMirror(
        mirror: CodeMirror.Editor, flag: boolean
    ) {
        let beg = mirror.getCursor('from');
        let beg_mod = mirror.getModeAt(beg);
        let end = mirror.getCursor('to');
        let end_mod = mirror.getModeAt(end);
        let tex = '\\prod_{i=a}^{b}{i}';
        if (beg_mod && beg_mod.name === 'markdown' &&
            end_mod && end_mod.name === 'markdown'
        ) {
            if (flag) {
                mirror.replaceRange(
                    `\n$$${tex}$$\n`, beg, end
                );
                mirror.setSelection({
                    line: beg.line + 1, ch: 9
                }, {
                    line: beg.line + 1, ch: 12
                });
            } else {
                mirror.replaceRange(
                    `$${tex}$`, beg, end
                );
                mirror.setSelection({
                    line: beg.line, ch: beg.ch + 8
                }, {
                    line: beg.line, ch: beg.ch + 11
                });
            }
        }
    }
    private onProductClickSimple(flag: boolean) {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let beg = inp.selectionStart as number;
        let end = inp.selectionEnd as number;
        let tex = '\\prod_{i=a}^{b}{i}';
        inp.setSelectionRange(beg, end);
        if (flag) {
            if (!document.execCommand(
                'insertText', false, `\n$$${tex}$$\n`
            )) {
                let px = val.substring(0, beg);
                let sx = val.substring(end, val.length);
                this.ed.$input.val(`${px}\n$$${tex}$$\n${sx}`);
            }
            inp.setSelectionRange(beg + 10, beg + 13);
        } else {
            if (!document.execCommand(
                'insertText', false, `$${tex}$`
            )) {
                let px = val.substring(0, beg);
                let sx = val.substring(end, val.length);
                this.ed.$input.val(`${px}$${tex}$${sx}`);
            }
            inp.setSelectionRange(beg + 8, beg + 11);
        }
        this.ed.$input.trigger('change');
    }
    private onSupscriptClick() {
        if (this.ed.mirror) {
            this.onSupscriptClickMirror(this.ed.mirror);
        } else {
            this.onSupscriptClickSimple();
        }
        this.ed.focus();
    }
    private onSupscriptClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let cur = mirror.getCursor();
        let mod = mirror.getModeAt(cur);
        if (mod && mod.name === 'markdown' ||
            mod && mod.name === 'stex'
        ) {
            mirror.replaceRange('^{ }', cur);
            mirror.setSelection({
                line: cur.line, ch: cur.ch + 2
            }, {
                line: cur.line, ch: cur.ch + 3
            });
        }
    }
    private onSupscriptClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let end = inp.selectionEnd as number;
        inp.setSelectionRange(end, end);
        if (!document.execCommand('insertText', false, '^{ }')) {
            let px = val.substring(0, end);
            let sx = val.substring(end, val.length);
            this.ed.$input.val(`${px}^{ }${sx}`);
        }
        inp.setSelectionRange(end + 2, end + 3);
        this.ed.$input.trigger('change');
    }
    private onSubscriptClick() {
        if (this.ed.mirror) {
            this.onSubscriptClickMirror(this.ed.mirror);
        } else {
            this.onSubscriptClickSimple();
        }
        this.ed.focus();
    }
    private onSubscriptClickMirror(
        mirror: CodeMirror.Editor
    ) {
        let cur = mirror.getCursor();
        let mod = mirror.getModeAt(cur);
        if (mod && mod.name === 'markdown' ||
            mod && mod.name === 'stex'
        ) {
            mirror.replaceRange('_{ }', cur);
            mirror.setSelection({
                line: cur.line, ch: cur.ch + 2
            }, {
                line: cur.line, ch: cur.ch + 3
            });
        }
    }
    private onSubscriptClickSimple() {
        let inp = this.ed.$input[0] as HTMLInputElement;
        let val = this.ed.$input.val() as string;
        let end = inp.selectionEnd as number;
        inp.setSelectionRange(end, end);
        if (!document.execCommand('insertText', false, '_{ }')) {
            let px = val.substring(0, end);
            let sx = val.substring(end, val.length);
            this.ed.$input.val(`${px}_{ }${sx}`);
        }
        inp.setSelectionRange(end + 2, end + 3);
        this.ed.$input.trigger('change');
    }
    private lhs(
        mirror: CodeMirror.Editor, cursor: any, token: any
    ): CodeMirror.Position {
        let last = { line: cursor.line, ch: cursor.ch };
        let next = { line: cursor.line, ch: cursor.ch };
        while (true) {
            let next_token = mirror.getTokenAt(next);
            if (next_token.type && !next_token.type.match(token.type) ||
                !next_token.type && next_token.type !== token.type) {
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
                    next.ch = mirror.getLine(
                        next.line
                    ).length;
                } else {
                    return last;
                }
            }
        }
    }
    private rhs(
        mirror: CodeMirror.Editor, cursor: any, token: any
    ): CodeMirror.Position {
        let last = { line: cursor.line, ch: cursor.ch };
        let next = { line: cursor.line, ch: cursor.ch };
        while (true) {
            let next_token = mirror.getTokenAt(next);
            if (next_token.type && !next_token.type.match(token.type) ||
                !next_token.type && next_token.type !== token.type
            ) {
                return last;
            } else {
                last = {
                    ch: next.ch, line: next.line
                };
            }
            if (next.ch < mirror.getLine(next.line).length) {
                next.ch += 1;
            } else {
                if (next.line < mirror.lineCount()) {
                    next.line += 1;
                    next.ch = mirror
                        .getLine(next.line).length;
                } else {
                    return last;
                }
            }
        }
    }
    private get $bold() {
        return $('.glyphicon-bold').closest('button');
    }
    private get $copy() {
        return $('.glyphicon-copy').closest('button');
    }
    private get $cut() {
        return $('.glyphicon-scissors').closest('button');
    }
    private get $header() {
        return $('.glyphicon-header').closest('button');
    }
    private get $erase() {
        return $('.glyphicon-erase').closest('button');
    }
    private get $font() {
        return $('.glyphicon-font').closest('button');
    }
    private get $indent() {
        return $('.glyphicon-indent-left').closest('button');
    }
    private get $inner() {
        return this.$outer.find('>.toolbar-inner');
    }
    private get $italic() {
        return $('.glyphicon-italic').closest('button');
    }
    private get $link() {
        return $('.glyphicon-link').closest('button');
    }
    private get $image() {
        return $('.glyphicon-picture').closest('button');
    }
    private get $video() {
        return $('.glyphicon-film').closest('button');
    }
    private get $outdent() {
        return $('.glyphicon-indent-right').closest('button');
    }
    private get $outer() {
        return $('.lhs>.toolbar-outer');
    }
    private get $paste() {
        return $('.glyphicon-paste').closest('button');
    }
    private get $print() {
        return $('.glyphicon.print').closest('button');
    }
    private get $product() {
        return $('.glyphicon.product').closest('button');
    }
    private get $publish() {
        return $('.glyphicon.publish').closest('button');
    }
    private get $redo() {
        return $('.glyphicon.redo').closest('button');
    }
    private get $refresh() {
        return $('.glyphicon.refresh').closest('button');
    }
    private get $subscript() {
        return $('.glyphicon-subscript').closest('button');
    }
    private get $supscript() {
        return $('.glyphicon.superscript').closest('button');
    }
    private get $sum() {
        return $('.glyphicon.sum').closest('button');
    }
    private get $toolbar() {
        return this.$inner.find('>.md-toolbar');
    }
    private get $undo() {
        return $('.glyphicon.undo').closest('button');
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
    private _clipboard: string | undefined; //@TODO: [I]Clipboard?
    private _scroll: any;
}
export default MdEditorToolbar;
