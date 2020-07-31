import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdOutdent implements Command {
    public redo() {
        if (this.ed.mirror) {
            this.onOutdentClickMirror(this.ed.mirror);
        } else {
            this.onOutdentClickSimple();
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
    private onOutdentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentLess');
    }
    private onOutdentClickSimple() {
        const inp = this.ui.$lhsInput[0] as HTMLInputElement;
        const val = this.ui.$lhsInput.val() as string;
        const beg = inp.selectionStart as number;
        const end = inp.selectionEnd as number;
        let idx = beg - 1;
        while (idx >= 0 && val[idx] !== '\n') {
            idx -= 1;
        }
        const px = val.substring(0, idx + 1);
        const sx = val.substring(idx + 1, val.length);
        const rx = /^\s{2}/;
        const mm = sx.match(rx);
        if (mm && mm.length > 0) {
            inp.setSelectionRange(idx + 1, idx + 3);
            if (!document.execCommand('insertText', false, '')) {
                this.ui.$lhsInput.val(`${px}${sx.substring(2)}`);
            }
            if (beg > 0 && val[beg - 1] === '\n') {
                inp.setSelectionRange(beg, end);
            } else {
                inp.setSelectionRange(beg - 2, end - 2);
            }
            this.ui.$lhsInput.trigger('change');
        }
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default MdOutdent;
