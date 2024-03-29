import { LhsToolbar } from "../lhs-toolbar/index";
import { RhsToolbar } from "../rhs-toolbar/index";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

import { OpenFileFrom } from "../../commands/open-file-from";
import { Commands } from "../../commands/index";
import { trace } from "../../decorator/trace";

@trace
export class NavHeader {
    public static get me(): NavHeader {
        if (window.NAV_HEADER === undefined) {
            window.NAV_HEADER = new NavHeader();
        }
        return window.NAV_HEADER;
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
            Commands.me.run(new OpenFileFrom(file));
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
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default NavHeader;
