import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class ToggleScrolling implements Command {
    public redo() {
        const $button = this.ui.$toolbarLockScrolling;
        if (this.ed.lockScroll) {
            $button.prop('title', 'Lock Scrolling [CTRL+L]');
            $button.removeClass('active');
            this.ed.lockScroll = false;
        } else {
            $button.prop('title', 'Unlock Scrolling [CTRL+L]');
            $button.addClass('active');
            this.ed.lockScroll = true;
        }
        return Promise.resolve(this);
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default ToggleScrolling;
