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

        $('.glyphicon-scissors').closest('button')
            .on('click', this.onScissorsClick.bind(this));
        $('.glyphicon-duplicate').closest('button')
            .on('click', this.onDuplicateClick.bind(this));
        $('.glyphicon-paste').closest('button')
            .on('click', this.onPasteClick.bind(this));
        $('.glyphicon-erase').closest('button')
            .on('click', this.onEraseClick.bind(this));
    }

    public refresh() {
        this._scroll.refresh();
    }

    private onScissorsClick(ev:MouseEvent) {
    }

    private onDuplicateClick(ev:MouseEvent) {
    }

    private onPasteClick(ev:MouseEvent) {
    }

    private onEraseClick(ev:MouseEvent) {
    }

    private _scroll:any;
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorToolbar;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
