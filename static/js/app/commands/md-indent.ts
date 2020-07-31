import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class MdIndent implements Command {
    public redo() {
        if (this.ed.mirror) {
            this.onIndentClickMirror(this.ed.mirror);
        } else {
            this.onIndentClickSimple();
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
    private onIndentClickMirror(
        mirror: CodeMirror.Editor
    ) {
        mirror.execCommand('indentMore');
    }
    private onIndentClickSimple() {
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
        inp.setSelectionRange(idx + 1, idx + 1);
        if (!document.execCommand('insertText', false, '  ')) {
            this.ui.$lhsInput.val(`${px}  ${sx}`);
        }
        inp.setSelectionRange(beg + 2, end + 2);
        this.ui.$lhsInput.trigger('change');
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default MdIndent;
