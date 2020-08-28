import { Command } from "./index";
import { Ui } from "../ui/index";

export class OpenFile implements Command {
    public redo() {
        this.ui.$toolbarOpen.click();
        return Promise.resolve(this);
    }
    private get ui() {
        return Ui.me;
    }
}
export default OpenFile;
