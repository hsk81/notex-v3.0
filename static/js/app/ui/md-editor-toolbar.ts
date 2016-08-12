///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {Commands} from '../commands/commands';
import {Command} from '../commands/commands';
import {MdEditor} from './md-editor';

import {named} from '../decorator/named';
import {trace} from '../decorator/trace';
import {seq} from '../function/seq';

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

        this.$mdInp
            .on('keypress', this.onMdInpKeyPress.bind(this));
        this.$mdInp
            .on('keydown', this.onMdInpKeyDown.bind(this));

        this.refresh();
    }

    public refresh() {
        this.scroll.refresh();
    }

    private onUndoClick(ev: MouseEvent) {
        this.commands.undo();
    }

    private onRedoClick(ev: MouseEvent) {
        this.commands.redo();
    }

    private onCutClick(ev: MouseEvent) {
        this.$mdInp.one('focus', () => {
            let beg = this.$mdInp[0].selectionStart,
                end = this.$mdInp[0].selectionEnd,
                val = this.$mdInp[0].value;
            let txt = this.clipboard,
                len = Math.abs(end - beg);

            if (len) this.commands.run(new Command(
                seq(() => {
                    this.$mdInp[0].value = val.slice(0, beg) + val.slice(end);
                    this.$mdInp[0].setSelectionRange(beg, beg);
                    this.$mdInp.focus();
                }, () => {
                    this.clipboard = val.slice(beg, end);
                }, () => {
                    this.render();
                }),
                seq(() => {
                    this.$mdInp[0].value = val;
                    this.$mdInp[0].setSelectionRange(beg, end);
                    this.$mdInp.focus();
                }, () => {
                    this.clipboard = txt;
                }, () => {
                    this.render();
                })
            ));
        });
        this.$mdInp.focus();
    }

    private onCopyClick(ev: MouseEvent) {
        this.$mdInp.one('focus', () => {
            let beg = this.$mdInp[0].selectionStart,
                end = this.$mdInp[0].selectionEnd,
                val = this.$mdInp[0].value;
            try {
                document.execCommand('copy');
            } catch (ex) {
                console.error(ex);
            }
            this.clipboard = val.slice(beg, end);
        });
        this.$mdInp.focus();
    }

    private onPasteClick(ev: MouseEvent) {
        this.$mdInp.one('focus', () => {
            let beg = this.$mdInp[0].selectionStart,
                end = this.$mdInp[0].selectionEnd,
                val = this.$mdInp[0].value;
            let txt = this.clipboard,
                len = txt.length;

            this.commands.run(new Command(
                seq(() => {
                    this.$mdInp[0].value =
                        val.slice(0, beg) + txt + val.slice(end);
                    this.$mdInp[0].setSelectionRange(beg + len, beg + len);
                    this.$mdInp.focus();
                }, () => {
                    this.clipboard = txt;
                }, () => {
                    this.render();
                }),
                seq(() => {
                    this.$mdInp[0].value = val;
                    this.$mdInp[0].setSelectionRange(beg, end);
                    this.$mdInp.focus();
                }, () => {
                    this.clipboard = txt;
                }, () => {
                    this.render();
                })
            ));
        });
        this.$mdInp.focus();
    }

    private onEraseClick(ev: MouseEvent) {
        this.$mdInp.one('focus', () => {
            let beg = this.$mdInp[0].selectionStart,
                end = this.$mdInp[0].selectionEnd,
                val = this.$mdInp[0].value;
            let txt = val.slice(beg, end),
                len = txt.length;

            if (len) this.commands.run(new Command(
                seq(() => {
                    this.$mdInp[0].value = val.slice(0, beg) + val.slice(end);
                    this.$mdInp[0].setSelectionRange(beg, beg);
                    this.$mdInp.focus();
                }, () => {
                    this.render();
                }),
                seq(() => {
                    this.$mdInp[0].value = val;
                    this.$mdInp[0].setSelectionRange(beg, end);
                    this.$mdInp.focus();
                }, () => {
                    this.render();
                })
            ));
        });
        this.$mdInp.focus();
    }

    private onMdInpKeyPress(ev: KeyboardEvent) {
        switch (ev.key) {
            case 'z':
                return this.onLowerZKeyPress(ev);
            case 'Z':
                return this.onUpperZKeyPress(ev);
        }
    }

    private onLowerZKeyPress(ev: KeyboardEvent) {
        if (ev.ctrlKey) {
            this.commands.undo();
            return false;
        }
    }

    private onUpperZKeyPress(ev: KeyboardEvent) {
        if (ev.ctrlKey) {
            this.commands.redo();
            return false;
        }
    }

    private onMdInpKeyDown(ev: KeyboardEvent) {
        switch (ev.key) {
            case 'c':
                return this.onLowerCKeyDown(ev);
            case 'v':
                return this.onLowerVKeyDown(ev);
            case 'x':
                return this.onLowerXKeyDown(ev);
            case 'Delete':
                return this.onDeleteKeyDown(ev);
        }
    }

    private onLowerCKeyDown(ev: KeyboardEvent) {
        if (ev.ctrlKey) {
            this.$copy.click();
            return false;
        }
    }

    private onLowerVKeyDown(ev: KeyboardEvent) {
        if (ev.ctrlKey) {
            this.$paste.click();
            return false;
        }
    }

    private onLowerXKeyDown(ev: KeyboardEvent) {
        if (ev.ctrlKey) {
            this.$cut.click();
            return false;
        }
    }

    private onDeleteKeyDown(ev: KeyboardEvent) {
        if (ev.ctrlKey && !ev.shiftKey) {
            this.$erase.click();
            return false;
        }
    }

    private render() {
        MdEditor.me.render();
    }

    private get $undo() {
        return $('.glyphicon.undo').closest('button');
    }

    private get $redo() {
        return $('.glyphicon.redo').closest('button');
    }

    private get $erase() {
        return $('.glyphicon-erase').closest('button');
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

    private get $mdInp() {
        return $('#md-inp');
    }

    private get commands(): Commands {
        return Commands.me;
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
