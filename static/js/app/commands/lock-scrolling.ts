import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { trace } from "../decorator/trace";

@trace
export class LockScrolling implements Command {
    public redo() {
        const $button = this.ui.$toolbarLockScrolling;
        const active = $button.hasClass('active');
        if (active) {
            $button.prop('title', 'Unlock Scrolling');
        } else {
            $button.prop('title', 'Lock Scrolling');
        }
        this.ed.lockScroll = active;
        return Promise.resolve(this);
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default LockScrolling;
