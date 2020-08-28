import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class MathIntegral implements Command {
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
                `\n$$\\int_{a}^{b}{t}\\,dt$$\n`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 10)
            );
        } else {
            this.ed.replaceSelection(
                `$\\int_{a}^{b}{t}\\,dt$`
            );
            this.ed.setSelection(
                new Location(lhs.number, 7),
                new Location(lhs.number, 8)
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
export default MathIntegral;
