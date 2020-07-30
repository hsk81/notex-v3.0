import { trace } from "../decorator/trace";
import { Command } from "./index";
import { Ui } from "../ui/index";

@trace
export class SaveFile implements Command {
    public redo() {
        const a = document.createElement('a')
        a.href = this.ui.$toolbarSave.attr('href') as any;
        a.download = this.ui.$toolbarSave.attr('download') as any;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return Promise.resolve(this);
    }
    private get ui() {
        return Ui.me;
    }
}
export default SaveFile;
