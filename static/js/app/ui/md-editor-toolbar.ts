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
            .on('click', this.onFontClick.bind(this));

        this.refresh();
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

    private onHeaderClick(ev: MouseEvent) {
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
        let cursor = this.editor.getCursor(),
            token = this.editor.getTokenAt(cursor),
            mode = this.editor.getModeAt(cursor);

        let lhs = (cursor, token) => {
            let last = {line: cursor.line, ch: cursor.ch},
                next = {line: cursor.line, ch: cursor.ch};
            while (true) {
                let next_token = this.editor.getTokenAt(next);
                if (next_token.type && !next_token.type.match(token.type) ||
                    !next_token.type && next_token.type !== token.type)
                {
                    return last = {
                        line: next.line, ch: next.ch
                    };
                } else {
                    last = {
                        line: next.line, ch: next.ch
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
        };
        let rhs = (cursor, token) => {
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
                        line: next.line, ch: next.ch
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
        };

        if (mode && mode.name === 'markdown') {
            let selection = this.editor.getSelection();
            if (selection) {
                if (token.type && token.type.match(/strong/) ||
                    token.type && token.type.match(/em/))
                {
                    if (token.type.match(/strong/)) {
                        let lhs_cursor = lhs(cursor, token),
                            rhs_cursor = rhs(cursor, token);
                        let range = this.editor.getRange(lhs_cursor, rhs_cursor),
                            text = range.slice(2, range.length - 2);
                        this.editor.replaceRange(text, lhs_cursor, rhs_cursor);
                        this.editor.setSelection(lhs_cursor, {
                            line: rhs_cursor.line, ch: rhs_cursor.ch - 4
                        });
                    } else {
                        let lhs_cursor = lhs(cursor, token),
                            rhs_cursor = rhs(cursor, token);
                        let range = this.editor.getRange(lhs_cursor, rhs_cursor),
                            text = '*' + range + '*';
                        this.editor.replaceRange(text, lhs_cursor, rhs_cursor);
                        this.editor.setSelection(lhs_cursor, {
                            line: rhs_cursor.line, ch: rhs_cursor.ch + 2
                        });
                    }
                } else {
                    this.editor.replaceSelection('**' + selection + '**', 'around');
                }
            } else {
                if (token.type && token.type.match(/strong/) ||
                    token.type && token.type.match(/em/))
                {
                    if (token.type.match(/em/)) {
                        let lhs_cursor = lhs(cursor, token),
                            rhs_cursor = rhs(cursor, token);
                        let range = this.editor.getRange(lhs_cursor, rhs_cursor),
                            text = '*' + range + '*';
                        this.editor.replaceRange(text, lhs_cursor, rhs_cursor);
                        this.editor.setSelection(lhs_cursor, {
                            line: rhs_cursor.line, ch: rhs_cursor.ch + 2
                        });
                    } else {
                        let lhs_cursor = lhs(cursor, token),
                            rhs_cursor = rhs(cursor, token);
                        let range = this.editor.getRange(lhs_cursor, rhs_cursor),
                            text = range.slice(2, range.length - 2);
                        this.editor.replaceRange(text, lhs_cursor, rhs_cursor);
                        this.editor.setSelection(lhs_cursor, {
                            line: rhs_cursor.line, ch: rhs_cursor.ch - 4
                        });
                    }
                } else {
                    this.editor.replaceRange('****', cursor);
                    this.editor.setCursor({
                        line: cursor.line, ch: cursor.ch + 2
                    });
                }
            }
        }

        this.editor.focus();
    }

    private onItalicClick() {
        this.editor.focus();
    }

    private onFontClick() {
        this.editor.focus();
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
