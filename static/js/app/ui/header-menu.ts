///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/header-menu.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {mine} from "../decorator/mine";
import {named} from "../decorator/named";
import {trace} from "../decorator/trace";

import MdEditor from "./md-editor";
import MdEditorToolbar from "./md-editor-toolbar";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('HeaderMenu')
export class HeaderMenu {
    public static get me():HeaderMenu {
        if (this['_me'] === undefined) {
            this['_me'] = window['HEADER_MENU'] = new HeaderMenu();
        }
        return this['_me'];
    }

    public constructor() {
        this.$openItem
            .on('change', this.onOpenItemChange.bind(this));
        this.$swapItem
            .on('click', this.onSwapItemClick.bind(this));
    }

    @mine
    private onOpenItemChange(self, ev) {
        var files = ev.target.files;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type && files[i].type.match(/text/)) {
                let reader = new FileReader();
                reader.onload = function (progress_ev) {
                    var target = <any>progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string')
                    {
                        self.editor.setValue(target.result);
                        self.editor.focus();
                    }
                };
                reader.readAsText(files[i]);
            }
        }
    }

    private onSwapItemClick() {
        $('div.lhs').toggleClass('hidden-xs hidden-sm')
            .toggleClass('col-xs-12 col-sm-12');
        $('div.rhs').toggleClass('hidden-xs hidden-sm')
            .toggleClass('col-xs-12 col-sm-12');

        this.toolbar.refresh();
        this.editor.focus();
    }

    public get $openItem():any {
        return $('#source,#source-mob');
    }

    public get $saveItem():any {
        return $('a[name=save]');
    }

    public get $swapItem():any {
        return $('[name=swap]');
    }

    private get toolbar(): any {
        return MdEditorToolbar.me;
    }

    private get editor(): MdEditor {
        return MdEditor.me;
    }
}

///////////////////////////////////////////////////////////////////////////////

export default HeaderMenu;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
