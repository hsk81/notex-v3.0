import { Location } from "../lhs-editor/location";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

import { Commands } from "../../commands/index";
import { CopyText } from "../../commands/copy-text";
import { CutText } from "../../commands/cut-text";
import { DeleteText } from "../../commands/delete-text";
import { PasteText } from "../../commands/paste-text";
import { RedoText } from "../../commands/redo-text";
import { UndoText } from "../../commands/undo-text";

import { trace } from "../../decorator/trace";

@trace
export class LhsToolbar {
    public static get me(): LhsToolbar {
        if (window.LHS_TOOLBAR === undefined) {
            window.LHS_TOOLBAR = new LhsToolbar();
        }
        return window.LHS_TOOLBAR;
    }
    public constructor() {
        if (!this.ed.mobile) {
            this.ui.$lhsToolbar.fadeIn('slow', () => {
                this.refresh();
            });
        }
        this.ui.$toolbarBold
            .on('click', this.onBoldClick.bind(this));
        this.ui.$toolbarCopy
            .on('click', this.onCopyClick.bind(this));
        this.ui.$toolbarCut
            .on('click', this.onCutClick.bind(this));
        this.ui.$toolbarErase
            .on('click', this.onEraseClick.bind(this));
        this.ui.$toolbarFont
            .on('click', this.onCommentClick.bind(this));
        this.ui.$toolbarHeader
            .on('click', this.onHeaderClick.bind(this));
        this.ui.$toolbarImage
            .on('click', this.onImageClick.bind(this));
        this.ui.$toolbarIndent
            .on('click', this.onIndentClick.bind(this));
        this.ui.$toolbarItalic
            .on('click', this.onItalicClick.bind(this));
        this.ui.$toolbarLink
            .on('click', this.onLinkClick.bind(this));
        this.ui.$toolbarOutdent
            .on('click', this.onOutdentClick.bind(this));
        this.ui.$toolbarPaste
            .on('click', this.onPasteClick.bind(this));
        this.ui.$toolbarProduct
            .on('click', this.onProductClick.bind(this));
        this.ui.$toolbarRedo
            .on('click', this.onRedoClick.bind(this));
        this.ui.$toolbarSum
            .on('click', this.onSumClick.bind(this));
        this.ui.$toolbarSubscript
            .on('click', this.onSubscriptClick.bind(this));
        this.ui.$toolbarSupscript
            .on('click', this.onSupscriptClick.bind(this));
        this.ui.$toolbarUndo
            .on('click', this.onUndoClick.bind(this));
        this.ui.$toolbarVideo
            .on('click', this.onVideoClick.bind(this));
    }
    public refresh() {
        this.ed.refresh();
        this.scroll.refresh();
    }
    private onUndoClick() {
        Commands.me.run(new UndoText()).then(() => {
            this.ed.focus();
        });
    }
    private onRedoClick() {
        Commands.me.run(new RedoText()).then(() => {
            this.ed.focus();
        });
    }
    private onCopyClick() {
        Commands.me.run(new CopyText()).then(() => {
            this.ed.focus();
        });
    }
    private onCutClick() {
        Commands.me.run(new CutText()).then(() => {
            this.ed.focus();
        });
    }
    private onPasteClick() {
        Commands.me.run(new PasteText()).then(() => {
            this.ed.focus();
        });
    }
    private onEraseClick() {
        Commands.me.run(new DeleteText()).then(() => {
            this.ed.focus();
        });
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_6, '')}`);
            }
            inp.setSelectionRange(
                beg - mm_6[0].length, end - mm_6[0].length
            );
        } else if (mm_5 && mm_5.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_5[0].length + 1
            );
            if (!document.execCommand('insertText', false, mm_5[0] + '#')) {
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_5, mm_5[0] + '#')}`);
            }
            inp.setSelectionRange(
                beg + 1, end + 1
            );
        } else if (mm_0 && mm_0.length > 0) {
            inp.setSelectionRange(
                idx + 1, idx + mm_0[0].length + 1
            );
            if (!document.execCommand('insertText', false, '# ' + mm_0[0])) {
                this.ui.$lhsInput.val(`${px}${sx.replace(rx_0, '# ' + mm_0[0])}`);
            }
            inp.setSelectionRange(
                beg + mm_0[0].length + 2, end + mm_0[0].length + 2
            );
        }
        this.ui.$lhsInput.trigger('change');
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
                this.ui.$lhsInput.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 4);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 2, end + 2);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ui.$lhsInput.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 2, end - 2);
        } else {
            if (!document.execCommand('insertText', false, `**${ix_1}**`)) {
                this.ui.$lhsInput.val(`${px_1}**${ix_1}**${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 4);
        }
        this.ui.$lhsInput.trigger('change');
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
                this.ui.$lhsInput.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ui.$lhsInput.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `*${ix_1}*`)) {
                this.ui.$lhsInput.val(`${px_1}*${ix_1}*${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.ui.$lhsInput.trigger('change');
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
                this.ui.$lhsInput.val(`${px_1}${mm_1[1]}${sx_1}`);
            }
            inp.setSelectionRange(beg, end - 2);
        } else if (mm_2 && mm_2.length > 1) {
            inp.setSelectionRange(beg - 1, end + 1);
            if (!document.execCommand('insertText', false, mm_2[1])) {
                this.ui.$lhsInput.val(`${px_2}${mm_2[1]}${sx_2}`);
            }
            inp.setSelectionRange(beg - 1, end - 1);
        } else {
            if (!document.execCommand('insertText', false, `\`${ix_1}\``)) {
                this.ui.$lhsInput.val(`${px_1}\`${ix_1}\`${sx_1}`);
            }
            inp.setSelectionRange(beg, end + 2);
        }
        this.ui.$lhsInput.trigger('change');
    }
    private onImageClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, location?: Location
        ) => {
            const v = this.ed.getValue(location);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (location) {
                return new Location(i + location.number);
            } else {
                return new Location(i);
            }
        };
        const { value: caption, lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${caption||'CAPTION'}]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}](URL)`
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        }
        this.ed.focus();
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
            this.ui.$lhsInput.val(`${px}  ${sx}`);
        }
        inp.setSelectionRange(beg + 2, end + 2);
        this.ui.$lhsInput.trigger('change');
    }
    private onLinkClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const at_next = (
            sep: string, index?: Location
        ) => {
            const v = this.ed.getValue(index);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (index) {
                return new Location(i + index.number);
            } else {
                return new Location(i);
            }
        };
        const { value: text, lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${text||'TEXT'}]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else {
            this.ed.replaceSelection(
                `[${text||'TEXT'}](URL)`
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        }
        this.ed.focus();
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
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
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
                this.ui.$lhsInput.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                inp.setSelectionRange(beg, end);
            } else {
                inp.setSelectionRange(beg - 2, end - 2);
            }
            this.ui.$lhsInput.trigger('change');
        }
    }
    private onSumClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `\n$$\\sum_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(rhs.number, 12)
            );
        } else {
            this.ed.replaceSelection(
                `$\\sum_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 7),
                new Location(rhs.number, 10)
            );
        }
        this.ed.focus();
    }
    private onProductClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs, rhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `\n$$\\prod_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 10),
                new Location(rhs.number, 13)
            );
        } else {
            this.ed.replaceSelection(
                `$\\prod_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 8),
                new Location(rhs.number, 11)
            );
        }
        this.ed.focus();
    }
    private onSupscriptClick() {
        if (this.ed.isMode('markdown') === false &&
            this.ed.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.ed.getSelection();
        this.ed.insertValue(`^{ }`, rhs);
        this.ed.setSelection(
            new Location(rhs.number, 2),
            new Location(rhs.number, 3)
        );
        this.ed.focus();
    }
    private onSubscriptClick() {
        if (this.ed.isMode('markdown') === false &&
            this.ed.isMode('stex') === false
        ) {
            return;
        }
        const { rhs } = this.ed.getSelection();
        this.ed.insertValue(`_{ }`, rhs);
        this.ed.setSelection(
            new Location(rhs.number, 2),
            new Location(rhs.number, 3)
        );
        this.ed.focus();
    }
    private onVideoClick(ev: JQueryEventObject) {
        if (this.ed.isMode('markdown') === false) {
            return;
        }
        const { lhs } = this.ed.getSelection();
        if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey) {
            this.ed.replaceSelection(
                `@[prezi](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else if ((ev.ctrlKey || ev.metaKey)) {
            this.ed.replaceSelection(
                `@[vimeo](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else {
            this.ed.replaceSelection(
                `@[youtube](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 11),
                new Location(lhs.number, 14)
            );
        }
        this.ed.focus();
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
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.ui.$lhsToolbarOuter[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private get clipboard(): string {
        if (window.CLIPBOARD === undefined) {
            window.CLIPBOARD = '';
        }
        return window.CLIPBOARD;
    }
    private set clipboard(value: string) {
        window.CLIPBOARD = value;
    }
    private _scroll: any;
}
export default LhsToolbar;
