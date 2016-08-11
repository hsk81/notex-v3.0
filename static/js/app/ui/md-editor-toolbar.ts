///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-toolbar.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {Commands} from '../commands/commands';
import {Command} from '../commands/commands';

import {after} from '../function/after';
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

        this.$scissors
            .on('click', this.onScissorsClick.bind(this));
        this.$copy
            .on('click', this.onCopyClick.bind(this));
        this.$paste
            .on('click', this.onPasteClick.bind(this));
        this.$erase
            .on('click', this.onEraseClick.bind(this));

        this.$textarea
            .on('keypress', this.onTextAreaKeyPress.bind(this));
        this.$textarea
            .on('keydown', this.onTextAreaKeyDown.bind(this));
        this.$textarea
            .on('keyup', this.onTextAreaKeyUp.bind(this));
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

    private onScissorsClick(ev: MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            let txt = this.clipboard,
                len = Math.abs(end - beg);

            if (len) this.commands.run(new Command(
                after(() => {
                    this.$textarea[0].value =
                        val.slice(0, beg) + val.slice(end);
                    this.$textarea[0].setSelectionRange(beg, beg);
                    this.$textarea.focus();
                }, () => {
                    this.clipboard = val.slice(beg, end);
                }),

                after(() => {
                    this.$textarea[0].value = val;
                    this.$textarea[0].setSelectionRange(beg, end);
                    this.$textarea.focus();
                }, () => {
                    this.clipboard = txt;
                })
            ));
        });
        this.$textarea.focus();
    }

    private onCopyClick(ev: MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            try {
                document.execCommand('copy');
            } catch (ex) {
                console.error(ex);
            }
            this.clipboard = val.slice(beg, end);
        });
        this.$textarea.focus();
    }

    private onPasteClick(ev: MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            let txt = this.clipboard,
                len = txt.length;

            this.commands.run(new Command(
                after(() => {
                    this.$textarea[0].value =
                        val.slice(0, beg) + txt + val.slice(end);
                    this.$textarea[0].setSelectionRange(beg + len, beg + len);
                    this.$textarea.focus();
                }, () => {
                    this.clipboard = txt
                }),
                after(() => {
                    this.$textarea[0].value = val;
                    this.$textarea[0].setSelectionRange(beg, end);
                    this.$textarea.focus();
                }, () => {
                    this.clipboard = txt;
                })
            ));
        });
        this.$textarea.focus();
    }

    private onEraseClick(ev: MouseEvent) {
        this.$textarea.one('focus', () => {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;
            let txt = val.slice(beg, end),
                len = txt.length;

            if (len) this.commands.run(new Command(
                () => {
                    this.$textarea[0].value =
                        val.slice(0, beg) + val.slice(end);
                    this.$textarea[0].setSelectionRange(beg, beg);
                    this.$textarea.focus();
                },

                () => {
                    this.$textarea[0].value = val;
                    this.$textarea[0].setSelectionRange(beg, end);
                    this.$textarea.focus();
                }
            ));
        });
        this.$textarea.focus();
    }

    private onTextAreaKeyPress(ev: KeyboardEvent) {
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

    private onTextAreaKeyDown(ev: KeyboardEvent) {
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
            this.$scissors.click();
            return false;
        }
    }

    private onDeleteKeyDown(ev: KeyboardEvent) {
        if (ev.ctrlKey && !ev.shiftKey) {
            this.$erase.click();
            return false;
        } else {
            let beg = this.$textarea[0].selectionStart,
                end = this.$textarea[0].selectionEnd,
                val = this.$textarea[0].value;

            let dif = Math.abs(end - beg),
                bit = dif > 0 ? 0 : 1;
            let to_bet = val.slice(0, beg),
                to_end = val.slice(end + bit, val.length);

            this.$textarea[0].value = to_bet + to_end;
            this.$textarea[0].setSelectionRange(beg, beg);

            if (this._snapshot === null) {
                this._snapshot = {
                    beg: beg, end: end, val: val
                };
            }
            return false;
        }
    }

    private onTextAreaKeyUp(ev: KeyboardEvent) {
        switch (ev.key) {
            case 'Delete':
                return this.onDeleteKeyUp(ev);
        }
    }

    private onDeleteKeyUp(ev: KeyboardEvent) {
        if (!ev.ctrlKey && !ev.shiftKey) {
            let old_beg = this._snapshot.beg,
                old_end = this._snapshot.end,
                old_val = this._snapshot.val;
            let new_beg = this.$textarea[0].selectionStart,
                new_end = this.$textarea[0].selectionEnd,
                new_val = this.$textarea[0].value;

            this._snapshot = null;
            this.$textarea.focus();

            this.commands.add(new Command(
                () => {
                    this.$textarea[0].value = new_val;
                    this.$textarea[0].setSelectionRange(new_beg, new_end);
                    this.$textarea.focus();
                },

                () => {
                    this.$textarea[0].value = old_val;
                    this.$textarea[0].setSelectionRange(old_beg, old_end);
                    this.$textarea.focus();
                }
            ));
            return false;
        }
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

    private get $scissors() {
        return $('.glyphicon-scissors').closest('button');
    }

    private get $copy() {
        return $('.glyphicon-copy').closest('button');
    }

    private get $paste() {
        return $('.glyphicon-paste').closest('button');
    }

    private get $textarea() {
        return $('textarea#md-inp');
    }

    private get commands(): Commands {
        if (this._commands === undefined) {
            this._commands = new Commands();
        }
        return this._commands;
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

    private _commands: Commands;
    private _clipboard: string;
    private _scroll: any;

    private _snapshot: {
        beg: number,
        end: number,
        val: string
    } = null;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorToolbar;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
