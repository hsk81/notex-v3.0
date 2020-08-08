import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdImage implements Command {
    constructor({ altKey, shiftKey }: {
        altKey: boolean, shiftKey: boolean
    }) {
        this.altKey = altKey;
        this.shiftKey = shiftKey;
    }
    public redo() {
        if (this.ed.isMode('markdown') === false) {
            return Promise.resolve(this);
        }
        const at_next = (
            sep: string, location?: Location
        ) => {
            const v = this.ed.getValue(location);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (location) {
                return new Location(i + location.number);
            } else {
                return new Location(i);
            }
        };
        const { value: caption, lhs } = this.ed.getSelection();
        if (this.altKey && this.shiftKey) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${caption||'CAPTION'}]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else if (this.altKey) {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
        } else {
            this.ed.replaceSelection(
                `![${caption||'CAPTION'}](URL)`
            );
            if (caption.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 4 + caption.length),
                    new Location(lhs.number, 7 + caption.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 2),
                    new Location(lhs.number, 9)
                );
            }
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
    private shiftKey: boolean;
}
export default MdImage;
