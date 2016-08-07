///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {mine} from '../decorator/mine';
import {named} from '../decorator/named';
import {trace} from '../decorator/trace';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditorToolbar')
export class MdEditorToolbar {
    public static get me():MdEditorToolbar {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditorToolbar();
        }
        return this['_me'];
    }

    public constructor() {
        this._scroll = new IScroll('#md-wrap', {
            interactiveScrollbars: true,
            mouseWheel: true,
            scrollbars: true
        });

        $('.glyphicon.undo').closest('button')
            .on('click', this.onUndoClick.bind(this));
        $('.glyphicon.redo').closest('button')
            .on('click', this.onRedoClick.bind(this));
        $('.glyphicon-erase').closest('button')
            .on('click', this.onEraseClick.bind(this));
        $('.glyphicon-scissors').closest('button')
            .on('click', this.onScissorsClick.bind(this));
        $('.glyphicon-copy').closest('button')
            .on('click', this.onCopyClick.bind(this));
        $('.glyphicon-paste').closest('button')
            .on('click', this.onPasteClick.bind(this));

        $('.glyphicon-indent-left').closest('button')
            .on('click', this.onIndentLeftClick.bind(this));
        $('.glyphicon-indent-right').closest('button')
            .on('click', this.onIndentRightClick.bind(this));
    }

    public refresh() {
        this._scroll.refresh();
    }

    private onUndoClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let result = document.execCommand('undo');
            if (result !== true) {
                console.debug('[on:undo]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onRedoClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let result = document.execCommand('redo');
            if (result !== true) {
                console.debug('[on:redo]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onEraseClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let result = document.execCommand('delete');
            if (result !== true) {
                console.debug('[on:erase]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onScissorsClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            this._text = val.slice(beg, end);

            let result = document.execCommand('cut');
            if (result !== true) {
                console.debug('[on:cut]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onCopyClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            this.text = val.slice(beg, end);

            let result = document.execCommand('copy');
            if (result !== true) {
                console.debug('[on:copy]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onPasteClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let result = document.execCommand('insertText', true, this.text);
            if (result !== true) {
                console.debug('[on:insertText]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onIndentLeftClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
             console.debug('[on:focus]'); // @TODO: implement!
        });
        this.$textarea.focus();
    }

    private onIndentRightClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
             console.debug('[on:focus]'); // @TODO: implement!
        });
        this.$textarea.focus();
    }

    private get $textarea() {
        return $('textarea#md-inp');
    }

    private get text():string {
        return this._text || '';
    }

    private set text(value:string) {
        this._text = value;
    }

    private _scroll:any;
    private _text:string;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorToolbar;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
