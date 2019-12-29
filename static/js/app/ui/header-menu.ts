import { mine } from "../decorator/mine";
import { trace } from "../decorator/trace";

import { MdEditor } from "./md-editor";
import { MdEditorToolbar } from "./md-editor-toolbar";

declare const $: JQueryStatic;

@trace
export class HeaderMenu {
    public static get me(this: any): HeaderMenu {
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
    private onOpenItemChange(self: any, ev: any) {
        let files = ev.target.files;
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type || files[i].type.match(/text/)) {
                let reader = new FileReader();
                reader.onload = function (progress_ev) {
                    let target = <any>progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string') {
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
    public get $openItem(): any {
        return $('#source-bar,#source-mob');
    }
    public get $saveItem(): any {
        return $('a[name=save]');
    }
    public get $swapItem(): any {
        return $('[name=swap]');
    }
    private get toolbar(): any {
        return MdEditorToolbar.me;
    }
    private get editor(): MdEditor {
        return MdEditor.me;
    }
}
export default HeaderMenu;
