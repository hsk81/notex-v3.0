import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MathSymbol implements Command {
    constructor({ altKey }: {
        altKey: boolean
    }) {
        this.altKey = altKey;
    }
    public redo() {
        if (this.ed.isMode('markdown') === false) {
            return Promise.resolve(this);
        }
        const { lhs, rhs, value } = this.ed.getSelection();
        if ((this.altKey)) {
            this.ed.replaceSelection(
                `\n$$${value}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 3),
                new Location(rhs.number, 3)
            );
        } else {
            this.ed.replaceSelection(
                `$${value}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 1),
                new Location(rhs.number, 1)
            );
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
    private altKey: boolean;
}
export default MathSymbol;
