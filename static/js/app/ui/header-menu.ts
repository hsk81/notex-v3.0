import { LhsToolbar } from "../components/lhs-toolbar/index";
import { RhsToolbar } from "../components/rhs-toolbar/index";
import { MdEditor } from "./md-editor";
import { Ui } from "./ui";

import { trace } from "../decorator/trace";

@trace
export class HeaderMenu {
    public static get me() {
        if (window.HEADER_MENU === undefined) {
            window.HEADER_MENU = new HeaderMenu();
        }
        return window.HEADER_MENU;
    }
    public constructor() {
        this.ui.$headerOpen.on(
            'change', this.onOpenItemChange.bind(this));
        this.ui.$headerSwap.on(
            'click', this.onSwapItemClick.bind(this));
        this.ui.$toolbarOpen.on(
            'change', this.onOpenItemChange.bind(this));
        this.ui.$toolbarSwap.on(
            'click', this.onSwapItemClick.bind(this));
    }
    private onOpenItemChange(ev: JQuery.ChangeEvent) {
        for (const file of ev.target.files) {
            if (!file.type || file.type.match(/text/)) {
                const reader = new FileReader();
                reader.onload = (progress_ev) => {
                    const target = progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string'
                    ) {
                        this.ed.setValue(target.result);
                        this.ed.render('hard');
                        this.ed.focus();
                    }
                };
                reader.readAsText(file);
            }
        }
    }
    private onSwapItemClick() {
        this.ui.$lhs
            .toggleClass('d-none d-md-block')
            .toggleClass('col-xs-12 col-sm-12');
        this.ui.$rhs
            .toggleClass('d-none d-md-block')
            .toggleClass('col-xs-12 col-sm-12');
        this.lhsToolbar.refresh();
        this.rhsToolbar.refresh();
        this.ed.focus();
    }
    private get lhsToolbar() {
        return LhsToolbar.me;
    }
    private get rhsToolbar() {
        return RhsToolbar.me;
    }
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default HeaderMenu;
