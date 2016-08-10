///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {Commands} from '../commands/commands';
import {Command} from '../commands/commands';
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
        this.scroll.refresh();
    }

    private onUndoClick(ev:MouseEvent) {
        /*
        this.$textarea.one('focus', () => {
            let result = document.execCommand('undo');
            if (result !== true) {
                console.debug('[on:undo]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
        */
        this.commands.undo();
    }

    private onRedoClick(ev:MouseEvent) {
        /*
        this.$textarea.one('focus', () => {
            let result = document.execCommand('redo');
            if (result !== true) {
                console.debug('[on:redo]'); // @TODO: implement!
            }
        });
        this.$textarea.focus();
        */
        this.commands.redo();
    }

    private onEraseClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;

            this.commands.run(new Command(
                () => {
                    this.$textarea[0].value =
                        val.slice(0, beg) + val.slice(end);
                    this.$textarea[0].setSelectionRange(beg, beg);
                    this.$textarea.focus();
                },
                () => {
                    this.$textarea[0].value = val;
                    this.$textarea[0].setSelectionRange(end, end);
                    this.$textarea.focus();
                }
            ));
        });
        this.$textarea.focus();
    }

    private onScissorsClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            this.clipboard = val.slice(beg, end);

            let result = document.execCommand('cut');
            if (result !== true) {
                // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onCopyClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            this.clipboard = val.slice(beg, end);

            let result = document.execCommand('copy');
            if (result !== true) {
                // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onPasteClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
            let result = document.execCommand('insertText', true, this.clipboard);
            if (result !== true) {
                // @TODO: implement!
            }
        });
        this.$textarea.focus();
    }

    private onIndentLeftClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
             // @TODO: implement!
        });
        this.$textarea.focus();
    }

    private onIndentRightClick(ev:MouseEvent) {
        this.$textarea.one('focus', () => {
             // @TODO: implement!
        });
        this.$textarea.focus();
    }

    private get $textarea() {
        return $('textarea#md-inp');
    }

    private get commands():Commands {
        if (this._commands === undefined) {
            this._commands = new Commands();
        }
        return this._commands;
    }

    private get scroll():any {
        if (this._scroll === undefined) {
            this._scroll =new IScroll('#md-wrap', {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }

    private get clipboard():string {
        if (this._clipboard === undefined) {
            this._clipboard = '';
        }
        return this._clipboard;
    }

    private set clipboard(value:string) {
        this._clipboard = value;
    }

    private _commands:Commands;
    private _clipboard:string;
    private _scroll:any;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorToolbar;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
