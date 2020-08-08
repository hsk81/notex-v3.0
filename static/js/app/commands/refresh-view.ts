import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { trace } from "../decorator/trace";

@trace
export class RefreshView implements Command {
    constructor({ altKey }: {
        altKey: boolean
    }) {
        this.altKey = altKey;
    }
    public async redo() {
        const $span = this.ui.$toolbarRefresh.find('span');
        setTimeout(() => $span.removeClass('spin'), 600);
        setTimeout(() => $span.addClass('spin'), 0);
        if ((this.altKey)) {
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
    private altKey: boolean;
}
export default RefreshView;
