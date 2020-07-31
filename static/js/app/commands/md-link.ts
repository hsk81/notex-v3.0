import { Location } from "../components/lhs-editor/location";
import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdLink implements Command {
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
        const at_next = (
            sep: string, index?: Location
        ) => {
            const v = this.ed.getValue(index);
            for (var i=0; i<v.length; i++) {
                if (v[i] === sep) break;
            }
            if (index) {
                return new Location(i + index.number);
            } else {
                return new Location(i);
            }
        };
        const { value: text, lhs } = this.ed.getSelection();
        if ((this.ctrlKey || this.metaKey) && this.shiftKey) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[${text||'TEXT'}]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(at.number, 3),
                    new Location(at.number, 3 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else if ((this.ctrlKey || this.metaKey)) {
            this.ed.replaceSelection(
                `[${text||'TEXT'}][REF]`
            );
            const at = at_next('\n', lhs);
            this.ed.insertValue(
                `\n\n[REF]: URL\n`, at
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
                );
            }
        } else {
            this.ed.replaceSelection(
                `[${text||'TEXT'}](URL)`
            );
            if (text.length) {
                this.ed.setSelection(
                    new Location(lhs.number, 3 + text.length),
                    new Location(lhs.number, 6 + text.length)
                );
            } else {
                this.ed.setSelection(
                    new Location(lhs.number, 1),
                    new Location(lhs.number, 5)
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
    private ctrlKey: boolean;
    private metaKey: boolean;
    private shiftKey: boolean;
}
export default MdLink;
