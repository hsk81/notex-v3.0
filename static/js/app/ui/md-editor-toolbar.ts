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
            from = {line: cursor.line, ch: 0},
            mode = this.editor.getModeAt(from);
        if (mode.name === 'markdown') {
            let line = this.editor.getLineHandle(from.line),
                suffix = line.text.match(/^\s+/) ? '' : ' ',
                prefix = '#';

            let tokens = this.editor.getLineTokens(from.line);
            if (tokens.length > 0 && tokens[0] &&
                tokens[0].type && tokens[0].type.match(/^header/))
            {
                let match_1 = tokens[0].type.match(/header-1$/),
                    match_2 = tokens[0].type.match(/header-2$/);
                if (match_1 && tokens[0].string === '=' ||
                    match_2 && tokens[0].string === '-')
                {
                    prefix += tokens[0].string === '=' ? '#' : '##';
                    this.editor.replaceRange('', from, {
                        ch: line.text.length, line: from.line,
                    });
                    this.editor.replaceRange(prefix + suffix, {
                        ch: 0, line: from.line - 1,
                    });
                    this.editor.setCursor({
                        ch: tokens[0].string === '=' ? 3 : 4,
                        line: from.line - 1,
                    });
                }
                else if (tokens[0].type.match(/header-6$/)) {
                    let match = line.text.match(/#{6,}\s*/),
                        match_string = match && match.toString();
                    this.editor.replaceRange('', from, {
                        ch: match_string ? match_string.length : 6,
                        line: from.line
                    });
                }
                else {
                    this.editor.replaceRange(prefix, from);
                }
            } else {
                this.editor.replaceRange(prefix + suffix, from);
            }
        }
        this.editor.focus();
    }

    private onBoldClick() {
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
