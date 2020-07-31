import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class CopyText implements Command {
    public redo() {
        const { value } = this.ed.getSelection();
        this.clipboard = value;
        try {
            document.execCommand('copy');
        } catch (ex) {
            console.error(ex);
        }
        return Promise.resolve(this);
    }
    public undo() {
        const mirror = this.ed.mirror;
        if (mirror) {
            mirror.execCommand('undo');
        } else {
            try {
                document.execCommand('undo')
            } catch (ex) {
                console.error(ex);
            }
            this.ui.$lhsInput.trigger('change');
        }
        return Promise.resolve(this);
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private set clipboard(value: string) {
        window.CLIPBOARD = value;
    }
}
export default CopyText;
