import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MathProduct implements Command {
    constructor({ ctrlKey, metaKey }: {
        ctrlKey: boolean, metaKey: boolean
    }) {
        this.ctrlKey = ctrlKey;
        this.metaKey = metaKey;
    }
    public redo() {
        if (this.ed.isMode('markdown') === false) {
            return Promise.resolve(this);
        }
        const { lhs, rhs } = this.ed.getSelection();
        if ((this.ctrlKey || this.metaKey)) {
            this.ed.replaceSelection(
                `\n$$\\prod_{i=a}^{b}{i}$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 10),
                new Location(rhs.number, 13)
            );
        } else {
            this.ed.replaceSelection(
                `$\\prod_{i=a}^{b}{i}$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 8),
                new Location(rhs.number, 11)
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
    private ctrlKey: boolean;
    private metaKey: boolean;
}
export default MathProduct;
