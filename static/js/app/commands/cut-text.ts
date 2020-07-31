import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class CutText implements Command {
    public redo() {
        const { value } = this.ed.getSelection();
        this.clipboard = value;
        const mirror = this.ed.mirror;
        if (mirror) {
            mirror.replaceSelection('');
        } else {
            try {
                document.execCommand('cut')
            } catch (ex) {
                console.error(ex);
            }
            this.ui.$lhsInput.trigger('change');
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
    private set clipboard(value: string) {
        window.CLIPBOARD = value;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default CutText;
