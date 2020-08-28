import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class MathProduct implements Command {
    constructor({ altKey }: {
        altKey: boolean
    }) {
        this.altKey = altKey;
    }
    public redo() {
        if (this.ed.isMode('markdown') === false) {
            return Promise.resolve(this);
        }
        const { lhs } = this.ed.getSelection();
        if ((this.altKey)) {
            this.ed.replaceSelection(
                `\n$$\\prod_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 10),
                new Location(lhs.number, 13)
            );
        } else {
            this.ed.replaceSelection(
                `$\\prod_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 8),
                new Location(lhs.number, 11)
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
export default MathProduct;
