///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {named} from '../decorator/named';
import {trace} from '../decorator/trace';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditorToolbar')
export class MdEditorToolbar {
    public static get me(): MdEditorToolbar {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditorToolbar();
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

        this.$indentLhs
            .on('click', this.onIndentLhsClick.bind(this));
        this.$indentRhs
            .on('click', this.onIndentRhsClick.bind(this));

        $('#md-wrap').show(() => {
            this.refresh();
        });
    }

    public refresh() {
        this.scroll.refresh();
        this.editor.refresh();
    }

    private onUndoClick() {
        this.editor.execCommand('undo');
        this.editor.focus();
    }

    private onRedoClick() {
        this.editor.execCommand('redo');
        this.editor.focus();
    }

    private onCutClick() {
        this.clipboard = this.editor.getSelection();
        this.editor.replaceSelection('');
        this.editor.focus();
    }

    private onCopyClick() {
        try {
            document.execCommand('copy');
        } catch (ex) {
            console.error(ex);
        }
        this.clipboard = this.editor.getSelection();
        this.editor.focus();
    }

    private onPasteClick() {
        this.editor.replaceSelection(this.clipboard);
        this.editor.focus();
    }

    private onEraseClick() {
        this.editor.replaceSelection('');
        this.editor.focus();
    }

    private onHeaderClick() {
        let cursor = this.editor.getCursor(),
            curr_from = {line: cursor.line, ch: 0},
            next_from = {line: cursor.line + 1, ch: 0};
        let curr_ts = this.editor.getLineTokens(curr_from.line),
            next_ts = this.editor.getLineTokens(next_from.line);
        let line = this.editor.getLineHandle(curr_from.line),
            mode = this.editor.getModeAt(curr_from);
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
                    this.editor.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    this.editor.replaceRange('#' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    this.editor.setCursor({
                        ch: 3, line: curr_from.line - 1
                    });
                }
                else if (h2s && h2s.length > 0) {
                    this.editor.replaceRange('', curr_from, {
                        ch: 0, line: curr_from.line + 1
                    });
                    this.editor.replaceRange('##' + prefix + suffix, {
                        ch: 0, line: curr_from.line - 1
                    });
                    this.editor.setCursor({
                        ch: 4, line: curr_from.line - 1
                    });
                }
                else if (h6s && h6s.length > 0) {
                    this.editor.replaceRange('', curr_from, {
                        ch: line.text.match(/\s*#{6}\s*/).toString().length,
                        line: curr_from.line,
                    });
                }
                else {
                    this.editor.replaceRange(prefix, {
                        ch: hs[0].start, line: curr_from.line
                    });
                }
            } else {
                if (next_ts.length > 0) {
                    let next_tok = next_ts[next_ts.length - 1];
                    if (next_tok.type && next_tok.type.match(/^header/)) {
                        if (next_tok.string === '=' &&
                            next_tok.type.match(/header-1$/)) {
                            this.editor.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '#';
                        }
                        if (next_tok.string === '-' &&
                            next_tok.type.match(/header-2$/)) {
                            this.editor.replaceRange('', next_from, {
                                line: next_from.line + 1, ch: 0
                            });
                            prefix += '##';
                        }
                    }
                }
                this.editor.replaceRange(prefix + suffix, curr_from);
            }
        }
        this.editor.focus();
    }

    private onBoldClick() {
        let selections = this.editor.listSelections();
        if (selections.length > 0 && this.editor.getSelection()) {
            this.editor.setSelections(selections.map((sel) => {
                let lhs_mod = this.editor.getModeAt(sel.head),
                    rhs_mod = this.editor.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel.head);
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
            this.editor.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch)
                {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.editor.getModeAt(sel_lhs),
                    mod_rhs = this.editor.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        if (tok.type.match(/em/)) {
                            return `*${this.editor.getRange(lhs, rhs)}*`;
                        } else {
                            return this.editor.getRange(lhs, rhs).slice(2, -2);
                        }
                    } else {
                        return `**${this.editor.getRange(sel_lhs, sel_rhs)}**`;
                    }
                } else {
                    return this.editor.getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.editor.getCursor(),
                mod = this.editor.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.editor.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/))
                {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    if (tok.type.match(/em/)) {
                        let src = this.editor.getRange(lhs, rhs),
                            tgt = `*${src}*`;
                        this.editor.replaceRange(tgt, lhs, rhs);
                        this.editor.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch + 2
                        });
                    } else {
                        let src = this.editor.getRange(lhs, rhs),
                            tgt = src.slice(2, -2);
                        this.editor.replaceRange(tgt, lhs, rhs);
                        this.editor.setSelection(lhs, {
                            line: rhs.line, ch: rhs.ch - 4
                        });
                    }
                } else {
                    this.editor.replaceRange('****', cur);
                    this.editor.setCursor({
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }

        this.editor.focus();
    }

    private onItalicClick() {
        let selections = this.editor.listSelections();
        if (selections.length > 0 && this.editor.getSelection()) {
            this.editor.setSelections(selections.map((sel) => {
                let lhs_mod = this.editor.getModeAt(sel.head),
                    rhs_mod = this.editor.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel.head);
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
            this.editor.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch)
                {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.editor.getModeAt(sel_lhs),
                    mod_rhs = this.editor.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/strong/) ||
                        tok.type && tok.type.match(/em/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        return this.editor.getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `*${this.editor.getRange(sel_lhs, sel_rhs)}*`;
                    }
                } else {
                    return this.editor.getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.editor.getCursor(),
                mod = this.editor.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.editor.getTokenAt(cur);
                if (tok.type && tok.type.match(/strong/) ||
                    tok.type && tok.type.match(/em/))
                {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    let src = this.editor.getRange(lhs, rhs),
                        tgt = src.slice(1, -1);
                    this.editor.replaceRange(tgt, lhs, rhs);
                    this.editor.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    this.editor.replaceRange('* *', cur);
                    this.editor.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }

        this.editor.focus();
    }

    private onCommentClick() {
        let selections = this.editor.listSelections();
        if (selections.length > 0 && this.editor.getSelection()) {
            this.editor.setSelections(selections.map((sel) => {
                let lhs_mod = this.editor.getModeAt(sel.head),
                    rhs_mod = this.editor.getModeAt(sel.anchor);
                if (lhs_mod && lhs_mod.name === 'markdown' &&
                    rhs_mod && rhs_mod.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel.head);
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
            this.editor.replaceSelections(selections.map((sel) => {
                let sel_lhs = sel.anchor,
                    sel_rhs = sel.head;
                if (sel_lhs.line > sel_rhs.line ||
                    sel_lhs.line === sel_rhs.line &&
                    sel_lhs.ch > sel_rhs.ch)
                {
                    sel_lhs = sel.head;
                    sel_rhs = sel.anchor;
                }
                let mod_lhs = this.editor.getModeAt(sel_lhs),
                    mod_rhs = this.editor.getModeAt(sel_rhs);
                if (mod_lhs && mod_lhs.name === 'markdown' &&
                    mod_rhs && mod_rhs.name === 'markdown')
                {
                    let tok = this.editor.getTokenAt(sel_rhs);
                    if (tok.type && tok.type.match(/comment/)) {
                        let lhs = this.lhs(sel_lhs, tok),
                            rhs = this.rhs(sel_rhs, tok);
                        return this.editor.getRange(lhs, rhs).slice(1, -1);
                    } else {
                        return `\`${this.editor.getRange(sel_lhs, sel_rhs)}\``;
                    }
                } else {
                    return this.editor.getRange(sel_lhs, sel_rhs);
                }
            }), 'around');
        } else {
            let cur = this.editor.getCursor(),
                mod = this.editor.getModeAt(cur);
            if (mod && mod.name === 'markdown') {
                let tok = this.editor.getTokenAt(cur);
                if (tok.type && tok.type.match(/comment/))
                {
                    let lhs = this.lhs(cur, tok),
                        rhs = this.rhs(cur, tok);
                    let src = this.editor.getRange(lhs, rhs),
                        tgt = src.slice(1, -1);
                    this.editor.replaceRange(tgt, lhs, rhs);
                    this.editor.setSelection(lhs, {
                        line: rhs.line, ch: rhs.ch - 2
                    });
                } else {
                    this.editor.replaceRange('` `', cur);
                    this.editor.setSelection({
                        line: cur.line, ch: cur.ch + 1
                    }, {
                        line: cur.line, ch: cur.ch + 2
                    });
                }
            }
        }

        this.editor.focus();
    }

    private onIndentLhsClick() {
        let cursor = this.editor.getCursor();
        this.editor.indentLine(cursor.line, 'add');
    }

    private onIndentRhsClick() {
        let cursor = this.editor.getCursor();
        this.editor.indentLine(cursor.line, 'subtract');
    }

    private lhs(cursor, token): {ch: number, line: number} {
        let last = {line: cursor.line, ch: cursor.ch},
            next = {line: cursor.line, ch: cursor.ch};
        while (true) {
            let next_token = this.editor.getTokenAt(next);
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
                    next.ch = this.editor.getLine(
                        next.line
                    ).length;
                } else {
                    return last;
                }
            }
        }
    }

    private rhs(cursor, token): {ch: number, line: number} {
        let last = {line: cursor.line, ch: cursor.ch},
            next = {line: cursor.line, ch: cursor.ch};
        while (true) {
            let next_token = this.editor.getTokenAt(next);
            if (next_token.type && !next_token.type.match(token.type) ||
                !next_token.type && next_token.type !== token.type)
            {
                return last;
            } else {
                last = {
                    ch: next.ch, line: next.line
                };
            }
            if (next.ch < this.editor.getLine(next.line).length) {
                next.ch += 1;
            } else {
                if (next.line < this.editor.lineCount()) {
                    next.line += 1;
                    next.ch = this.editor.getLine(
                        next.line
                    ).length;
                } else {
                    return last;
                }
            }
        }
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

    private get $supscript() {
        return $('.glyphicon-superscript').closest('button');
    }

    private get $subscript() {
        return $('.glyphicon-subscript').closest('button');
    }

    private get $indentLhs() {
        return $('.glyphicon-indent-left').closest('button');
    }

    private get $indentRhs() {
        return $('.glyphicon-indent-right').closest('button');
    }

    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll('#md-wrap', {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }

    private get editor(): any {
        return window['CODE_MIRROR'];
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
