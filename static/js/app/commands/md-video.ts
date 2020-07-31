import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdVideo implements Command {
    constructor({ ctrlKey, metaKey, shiftKey }: {
        ctrlKey: boolean, metaKey: boolean, shiftKey: boolean
    }) {
        this.ctrlKey = ctrlKey;
        this.metaKey = metaKey;
        this.shiftKey = shiftKey;
    }
    public redo() {
        if (this.ed.isMode('markdown') === false) {
            return Promise.resolve(this);
        }
        const { lhs } = this.ed.getSelection();
        if ((this.ctrlKey || this.metaKey) && this.shiftKey) {
            this.ed.replaceSelection(
                `@[prezi](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else if ((this.ctrlKey || this.metaKey)) {
            this.ed.replaceSelection(
                `@[vimeo](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 9),
                new Location(lhs.number, 12)
            );
        } else {
            this.ed.replaceSelection(
                `@[youtube](URL)`
            );
            this.ed.setSelection(
                new Location(lhs.number, 11),
                new Location(lhs.number, 14)
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
    private shiftKey: boolean;
}
export default MdVideo;
