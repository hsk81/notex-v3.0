import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { trace } from "../decorator/trace";

@trace
export class RefreshView implements Command {
    constructor({ ctrlKey, metaKey }: {
        ctrlKey: boolean, metaKey: boolean
    }) {
        this.ctrlKey = ctrlKey;
        this.metaKey = metaKey;
    }
    public async redo() {
        const $span = this.ui.$toolbarRefresh.find('span');
        setTimeout(() => $span.removeClass('spin'), 600);
        setTimeout(() => $span.addClass('spin'), 0);
        if ((this.ctrlKey || this.metaKey)) {
            await this.ed.render('hard');
        } else {
            await this.ed.render('soft');
        }
        return this;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private ctrlKey: boolean;
    private metaKey: boolean;
}
export default RefreshView;
