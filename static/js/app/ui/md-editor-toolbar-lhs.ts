import { trace } from "../decorator/trace";
import { MdEditor, Index } from "./md-editor";

declare const $: JQueryStatic;

@trace
export class MdEditorToolbarLhs {
    public static get me(this: any): MdEditorToolbarLhs {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_TOOLBAR_LHS'] = new MdEditorToolbarLhs();
        }
        return this['_me'];
    }
    public constructor() {
        if (!this.editor.mobile) {
            this.$outer.fadeIn('slow', () => {
                this.$toolbar.find('[data-toggle="tooltip"]').tooltip();
                this.$toolbar.find('[data-toggle="popover"]').popover();
                this.refresh();
            });
        }
        this.$bold
            .on('click', this.onBoldClick.bind(this));
        this.$copy
            .on('click', this.onCopyClick.bind(this));
        this.$cut
            .on('click', this.onCutClick.bind(this));
        this.$erase
            .on('click', this.onEraseClick.bind(this));
        this.$font
            .on('click', this.onCommentClick.bind(this));
        this.$header
            .on('click', this.onHeaderClick.bind(this));
        this.$image
            .on('click', this.onImageClick.bind(this));
        this.$indent
            .on('click', this.onIndentClick.bind(this));
        this.$italic
            .on('click', this.onItalicClick.bind(this));
        this.$link
            .on('click', this.onLinkClick.bind(this));
        this.$outdent
            .on('click', this.onOutdentClick.bind(this));
        this.$paste
            .on('click', this.onPasteClick.bind(this));
        this.$product
            .on('click', this.onProductClick.bind(this));
        this.$redo
            .on('click', this.onRedoClick.bind(this));
        this.$sum
            .on('click', this.onSumClick.bind(this));
        this.$subscript
            .on('click', this.onSubscriptClick.bind(this));
        this.$supscript
            .on('click', this.onSupscriptClick.bind(this));
        this.$undo
            .on('click', this.onUndoClick.bind(this));
        this.$video
            .on('click', this.onVideoClick.bind(this));
    }
    public refresh() {
        this.editor.refresh();
        this.scroll.refresh();
    }
    private onUndoClick() {
        const mirror = this.editor.mirror;
        if (mirror) {
            mirror.execCommand('undo');
        } else {
            try {
                document.execCommand('undo')
            } catch (ex) {
                console.error(ex);
            }
            this.editor.$input.trigger('change');
        }
        this.editor.focus();
    }
    private onRedoClick() {
        const mirror = this.editor.mirror;
        if (mirror) {
            mirror.execCommand('redo');
        } else {
            try {
                document.execCommand('redo')
            } catch (ex) {
                console.error(ex);
            }
            this.editor.$input.trigger('change');
        }
        this.editor.focus();
    }
    private onCutClick() {
        const { value } = this.editor.getSelection();
        this.clipboard = value;
        const mirror = this.editor.mirror;
        if (mirror) {
            mirror.replaceSelection('');
        } else {
            try {
                document.execCommand('cut')
            } catch (ex) {
                console.error(ex);
            }
            this.editor.$input.trigger('change');
        }
        this.editor.focus();
    }
    private onCopyClick() {
        const { value } = this.editor.getSelection();
        this.clipboard = value;
        try {
            document.execCommand('copy');
        } catch (ex) {
            console.error(ex);
        }
        this.editor.focus();
    }
    private onPasteClick() {
        const mirror = this.editor.mirror;
        if (mirror) {
            mirror.replaceSelection(this.clipboard);
        } else {
            try {
                document.execCommand('insertText', false, this.clipboard);
            } catch (ex) {
                console.error(ex);
            }
            this.editor.$input.trigger('change');
        }
        this.editor.focus();
    }
    private onEraseClick() {
        const mirror = this.editor.mirror;
        if (mirror) {
            mirror.replaceSelection('');
        } else {
            try {
                document.execCommand('insertText', false, '');
            } catch (ex) {
                console.error(ex);
            }
            this.editor.$input.trigger('change');
        }
        this.editor.focus();
    }
    private onHeaderClick() {
        if (this.editor.mirror) {
            this.onHeaderClickMirror(this.editor.mirror);
        } else {
            this.onHeaderClickSimple();
        }
        this.editor.focus();
    }
    private onHeaderClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const cursor = mirror.getCursor();
        const curr_from = { line: cursor.line, ch: 0 };
        const next_from = { line: cursor.line + 1, ch: 0 };
        const curr_ts = mirror.getLineTokens(curr_from.line);
        const next_ts = mirror.getLineTokens(next_from.line);
        const line = mirror.getLineHandle(curr_from.line);
        const mode = mirror.getModeAt(curr_from);
        const suffix = line.text.match(/^\s+/) ? '' : ' ';
        let prefix = '#';
        const hs = curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header/);
        });
        const h1s = line.text.match(/^\s*=/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-1/) &&
                tok.string === '=';
        });
        const h2s = line.text.match(/^\s*-{2}/) && curr_ts.filter((tok: any) => {
            return tok && tok.type && tok.type.match(/header-2/) &&
                tok.string === '-';
        });
        const h6s = line.text.match(/^\s*#{6}/) && curr_ts.filter((tok: any) => {
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
                    const match = line.text.match(/\s*#{6}\s*/);
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
                    const next_tok = next_ts[next_ts.length - 1];
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
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg as number;
        while (idx-- > 0) {
            if (val[idx] === '\n') {
                break;
            }
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        const rx_6 = /^\s*#{6,}\s*/;
        const mm_6 = sx.match(rx_6);
        const rx_5 = /^\s*#{1,5}/;
        const mm_5 = sx.match(rx_5);
        const rx_0 = /^\s*#{0}/;
        const mm_0 = sx.match(rx_0);
        if (mm_6 && mm_6.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_6[0].length + 1
            );
            if (!document.execCommand('insertText', false, '')) {
                this.editor.$input.val(`${px}${sx.replace(rx_6, '')}`);
            }
            inp.setSelectionRange(
                beg - mm_6[0].length, end - mm_6[0].length
            );
        } else if (mm_5 && mm_5.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_5[0].length + 1
            );
            if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                this.editor.$input.val(`${px}${sx.replace(rx_5, mm_5[0] + '#')}`);
            }
            inp.setSelectionRange(
                beg + 1, end + 1
            );
        } else if (mm_0 && mm_0.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_0[0].length + 1
            );
            if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                this.editor.$input.val(`${px}${sx.replace(rx_0, '# ' + mm_0[0])}`);
            }
            inp.setSelectionRange(
                beg + mm_0[0].length + 2, end + mm_0[0].length + 2
            );
        }
        this.editor.$input.trigger('change');
    }
    private onBoldClick() {
        if (this.editor.mirror) {
            this.onBoldClickMirror(this.editor.mirror);
        } else {
            this.onBoldClickSimple();
        }
        this.editor.focus();
    }
    private onBoldClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                const lhs_mod = mirror.getModeAt(sel.head);
                const rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel.head);
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
                const mod_lhs = mirror.getModeAt(sel_lhs);
                const mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        const lhs = this.lhs(mirror, sel_lhs, tok);
                        const rhs = this.rhs(mirror, sel_rhs, tok);
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
            const cur = mirror.getCursor();
            const mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                const tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)
                ) {
                    const lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    if (tok.type.match(/em/)) {
                        const src = mirror.getRange(lhs, rhs);
                        const tgt = `*${src}*`;
                        mirror.replaceRange(tgt, lhs, rhs);
                        mirror.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch + 2
                        });
                    } else {
                        const src = mirror.getRange(lhs, rhs);
                        const tgt = src.slice(2, -2);
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
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        const px_1 = val.substring(0, beg);
        const ix_1 = val.substring(beg, end);
        const sx_1 = val.substring(end, val.length);
        const px_2 = val.substring(0, beg - 2);
        const ix_2 = val.substring(beg - 2, end + 2);
        const sx_2 = val.substring(end + 2, val.length);
        const rx_1 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        const mm_1 = ix_1.match(rx_1);
        const rx_2 = /^\*\*((?:(?!\*\*).)+)\*\*$/;
        const mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.editor.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 4);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 2, end + 2);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.editor.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 2, end - 2);
        } else {
            if (!document.execCommand('insertText', false, `**${ix_1}**`)) {
                this.editor.$input.val(`${px_1}**${ix_1}**${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 4);
        }
        this.editor.$input.trigger('change');
    }
    private onItalicClick() {
        if (this.editor.mirror) {
            this.onItalicClickMirror(this.editor.mirror);
        } else {
            this.onItalicClickSimple();
        }
        this.editor.focus();
    }
    private onItalicClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                const lhs_mod = mirror.getModeAt(sel.head);
                const rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel.head);
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
                const mod_lhs = mirror.getModeAt(sel_lhs);
                const mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)
                    ) {
                        const lhs = this.lhs(mirror, sel_lhs, tok);
                        const rhs = this.rhs(mirror, sel_rhs, tok);
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
            const cur = mirror.getCursor();
            const mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                const tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/)
                ) {
                    const lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const src = mirror.getRange(lhs, rhs);
                    const tgt = src.slice(1, -1);
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
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        const px_1 = val.substring(0, beg);
        const ix_1 = val.substring(beg, end);
        const sx_1 = val.substring(end, val.length);
        const px_2 = val.substring(0, beg - 1);
        const ix_2 = val.substring(beg - 1, end + 1);
        const sx_2 = val.substring(end + 1, val.length);
        const rx_1 = /^\*([^*]+)\*$/;
        const mm_1 = ix_1.match(rx_1);
        const rx_2 = /^\*([^*]+)\*$/;
        const mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.editor.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.editor.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `*${ix_1}*`)) {
                this.editor.$input.val(`${px_1}*${ix_1}*${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.editor.$input.trigger('change');
    }
    private onCommentClick() {
        if (this.editor.mirror) {
            this.onCommentClickMirror(this.editor.mirror);
        } else {
            this.onCommentClickSimple();
        }
        this.editor.focus();
    }
    private onCommentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        const selections = mirror.listSelections();
        if (selections.length > 0 && mirror.getSelection()) {
            mirror.setSelections(selections.map((sel: any) => {
                const lhs_mod = mirror.getModeAt(sel.head);
                const rhs_mod = mirror.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel.head);
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
                const mod_lhs = mirror.getModeAt(sel_lhs);
                const mod_rhs = mirror.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown'
                ) {
                    const tok = mirror.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/comment/)) {
                        const lhs = this.lhs(mirror, sel_lhs, tok);
                        const rhs = this.rhs(mirror, sel_rhs, tok);
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
            const cur = mirror.getCursor();
            const mod = mirror.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                const tok = mirror.getTokenAt(cur);
                if (tok.type && tok.type.match(/comment/)) {
                    const lhs = this.lhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const rhs = this.rhs(mirror, cur, tok) as {
                        ch: number, line: number
                    };
                    const src = mirror.getRange(lhs, rhs);
                    const tgt = src.slice(1, -1);
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
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        const px_1 = val.substring(0, beg);
        const ix_1 = val.substring(beg, end);
        const sx_1 = val.substring(end, val.length);
        const px_2 = val.substring(0, beg - 1);
        const ix_2 = val.substring(beg - 1, end + 1);
        const sx_2 = val.substring(end + 1, val.length);
        const rx_1 = /^`([^`]+)`$/;
        const mm_1 = ix_1.match(rx_1);
        const rx_2 = /^`([^`]+)`$/;
        const mm_2 = ix_2.match(rx_2);
        if (mm_1 && mm_1.length > 1) {
            if (!document.execCommand('insertText', false, mm_1[1])) {
                this.editor.$input.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.editor.$input.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `\`${ix_1}\``)) {
                this.editor.$input.val(`${px_1}\`${ix_1}\`${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.editor.$input.trigger('change');
    }
    private onImageClick(ev: JQueryEventObject) {
        if (this.editor.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, index?: Index
        ) => {
            const v = this.editor.getValue(index);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (index) {
                return new Index(i + index.number);
            } else {
                return new Index(i);
            }
        };
        const { value: caption, lhs } = this.editor.getSelection();
        if (ev.ctrlKey && ev.shiftKey) {
            this.editor.replaceSelection(
                `![${caption||'CAPTION'}]`
            );
            const at = at_next('\n', lhs);
            this.editor.insertValue(
                `\n\n[${caption||'CAPTION'}]: URL\n`, at
            );
            if (caption.length) {
                this.editor.setSelection(
                    new Index(at.number, 3),
                    new Index(at.number, 3 + caption.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 2),
                    new Index(lhs.number, 9)
                );
            }
        } else if (ev.ctrlKey) {
            this.editor.replaceSelection(
                `![${caption||'CAPTION'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.editor.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (caption.length) {
                this.editor.setSelection(
                    new Index(lhs.number, 4 + caption.length),
                    new Index(lhs.number, 7 + caption.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 2),
                    new Index(lhs.number, 9)
                );
            }
        } else {
            this.editor.replaceSelection(
                `![${caption||'CAPTION'}](URL)`
            );
            if (caption.length) {
                this.editor.setSelection(
                    new Index(lhs.number, 4 + caption.length),
                    new Index(lhs.number, 7 + caption.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 2),
                    new Index(lhs.number, 9)
                );
            }
        }
        this.editor.focus();
    }
    private onIndentClick() {
        if (this.editor.mirror) {
            this.onIndentClickMirror(this.editor.mirror);
        } else {
            this.onIndentClickSimple();
        }
        this.editor.focus();
    }
    private onIndentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentMore');
    }
    private onIndentClickSimple() {
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        inp.setSelectionRange(idx + 1, idx + 1);
        if (!document.execCommand('insertText', false, '  ')) {
            this.editor.$input.val(`${px}  ${sx}`);
        }
        inp.setSelectionRange(beg + 2, end + 2);
        this.editor.$input.trigger('change');
    }
    private onLinkClick(ev: JQueryEventObject) {
        if (this.editor.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, index?: Index
        ) => {
            const v = this.editor.getValue(index);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (index) {
                return new Index(i + index.number);
            } else {
                return new Index(i);
            }
        };
        const { value: text, lhs } = this.editor.getSelection();
        if (ev.ctrlKey && ev.shiftKey) {
            this.editor.replaceSelection(
                `[${text||'TEXT'}]`
            );
            const at = at_next('\n', lhs);
            this.editor.insertValue(
                `\n\n[${text||'TEXT'}]: URL\n`, at
            );
            if (text.length) {
                this.editor.setSelection(
                    new Index(at.number, 3),
                    new Index(at.number, 3 + text.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 1),
                    new Index(lhs.number, 5)
                );
            }
        } else if (ev.ctrlKey) {
            this.editor.replaceSelection(
                `[${text||'TEXT'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.editor.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (text.length) {
                this.editor.setSelection(
                    new Index(lhs.number, 3 + text.length),
                    new Index(lhs.number, 6 + text.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 1),
                    new Index(lhs.number, 5)
                );
            }
        } else {
            this.editor.replaceSelection(
                `[${text||'TEXT'}](URL)`
            );
            if (text.length) {
                this.editor.setSelection(
                    new Index(lhs.number, 3 + text.length),
                    new Index(lhs.number, 6 + text.length)
                );
            } else {
                this.editor.setSelection(
                    new Index(lhs.number, 1),
                    new Index(lhs.number, 5)
                );
            }
        }
        this.editor.focus();
    }
    private onOutdentClick() {
        if (this.editor.mirror) {
            this.onOutdentClickMirror(this.editor.mirror);
        } else {
            this.onOutdentClickSimple();
        }
        this.editor.focus();
    }
    private onOutdentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentLess');
    }
    private onOutdentClickSimple() {
        const inp = this.editor.$input[0] as HTMLInputElement;
        const val = this.editor.$input.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        const rx = /^\s{2}/;
        const mm = sx.match(rx);
        if (mm && mm.length > 0) {
            inp.setSelectionRange(idx + 1, idx + 3);
            if (!document.execCommand('insertText', false, '')) {
                this.editor.$input.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                inp.setSelectionRange(beg, end);
            } else {
                inp.setSelectionRange(beg - 2, end - 2);
            }
            this.editor.$input.trigger('change');
        }
    }
    private onSumClick(ev: JQueryEventObject) {
        if (this.editor.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.editor.getSelection();
        if (ev.ctrlKey) {
            this.editor.replaceSelection(
                `\n$$\\sum_{i=a}^{b}{i}$$\n`
            );
            this.editor.setSelection(
                new Index(lhs.number, 9),
                new Index(rhs.number, 12)
            );
        } else {
            this.editor.replaceSelection(
                `$\\sum_{i=a}^{b}{i}$`
            );
            this.editor.setSelection(
                new Index(lhs.number, 7),
                new Index(rhs.number, 10)
            );
        }
        this.editor.focus();
    }
    private onProductClick(ev: JQueryEventObject) {
        if (this.editor.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.editor.getSelection();
        if (ev.ctrlKey) {
            this.editor.replaceSelection(
                `\n$$\\prod_{i=a}^{b}{i}$$\n`
            );
            this.editor.setSelection(
                new Index(lhs.number, 10),
                new Index(rhs.number, 13)
            );
        } else {
            this.editor.replaceSelection(
                `$\\prod_{i=a}^{b}{i}$`
            );
            this.editor.setSelection(
                new Index(lhs.number, 8),
                new Index(rhs.number, 11)
            );
        }
        this.editor.focus();
    }
    private onSupscriptClick() {
        if (this.editor.isMode('markdown') === false &&
            this.editor.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.editor.getSelection();
        this.editor.insertValue(`^{ }`, rhs);
        this.editor.setSelection(
            new Index(rhs.number, 2),
            new Index(rhs.number, 3)
        );
        this.editor.focus();
    }
    private onSubscriptClick() {
        if (this.editor.isMode('markdown') === false &&
            this.editor.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.editor.getSelection();
        this.editor.insertValue(`_{ }`, rhs);
        this.editor.setSelection(
            new Index(rhs.number, 2),
            new Index(rhs.number, 3)
        );
        this.editor.focus();
    }
    private onVideoClick(ev: JQueryEventObject) {
        if (this.editor.isMode('markdown') === false) {
            return;
        }
        const { lhs } = this.editor.getSelection();
        if (ev.ctrlKey && ev.shiftKey) {
            this.editor.replaceSelection(
                `@[prezi](URL)`
            );
            this.editor.setSelection(
                new Index(lhs.number, 9),
                new Index(lhs.number, 12)
            );
        } else if (ev.ctrlKey) {
            this.editor.replaceSelection(
                `@[vimeo](URL)`
            );
            this.editor.setSelection(
                new Index(lhs.number, 9),
                new Index(lhs.number, 12)
            );
        } else {
            this.editor.replaceSelection(
                `@[youtube](URL)`
            );
            this.editor.setSelection(
                new Index(lhs.number, 11),
                new Index(lhs.number, 14)
            );
        }
        this.editor.focus();
    }
    private lhs(
        mirror: CodeMirror.Editor, cursor: any, token: any
    ): CodeMirror.Position {
        let last = { line: cursor.line, ch: cursor.ch };
        let next = { line: cursor.line, ch: cursor.ch };
        while (true) {
            const next_token = mirror.getTokenAt(next);
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
            const next_token = mirror.getTokenAt(next);
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
    private get $outer() {
        return $('.lhs>.toolbar-outer');
    }
    private get $inner() {
        return this.$outer.find('>.toolbar-inner');
    }
    private get $toolbar() {
        return this.$inner.find('>.md-toolbar');
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
    private get $paste() {
        return $('.glyphicon-paste').closest('button');
    }
    private get $product() {
        return $('.glyphicon.product').closest('button');
    }
    private get $redo() {
        return $('.glyphicon.redo').closest('button');
    }
    private get $subscript() {
        return $('.glyphicon-subscript').closest('button');
    }
    private get $supscript() {
        return $('.glyphicon-superscript').closest('button');
    }
    private get $sum() {
        return $('.glyphicon.sum').closest('button');
    }
    private get $undo() {
        return $('.glyphicon.undo').closest('button');
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.$inner[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private get editor() {
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
export default MdEditorToolbarLhs;
