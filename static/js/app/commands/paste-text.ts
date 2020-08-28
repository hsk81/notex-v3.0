import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class PasteText implements Command {
    public redo() {
        const mirror = this.ed.mirror;
        if (mirror) {
            mirror.replaceSelection(this.clipboard);
        } else {
            try {
                document.execCommand('insertText', false, this.clipboard);
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
    private get clipboard() {
        if (window.CLIPBOARD === undefined) {
            window.CLIPBOARD = '';
        }
        return window.CLIPBOARD;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default PasteText;
