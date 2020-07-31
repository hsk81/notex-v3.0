import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MathSuperscript implements Command {
    public redo() {
        if (this.ed.isMode('markdown') === false &&
            this.ed.isMode('stex') === false
        ) {
            return Promise.resolve(this);
        }
        const { rhs } = this.ed.getSelection();
        this.ed.insertValue(`^{ }`, rhs);
        this.ed.setSelection(
            new Location(rhs.number, 2),
            new Location(rhs.number, 3)
        );
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
}
export default MathSuperscript;
