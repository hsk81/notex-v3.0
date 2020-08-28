import { Command } from "./index";
import { Ui } from "../ui/index";

export class PrintFile implements Command {
    public redo() {
        if (this.ui.$viewer[0].contentWindow) {
            this.ui.$viewer[0].contentWindow.print();
        }
        return Promise.resolve(this);
    }
    private get ui() {
        return Ui.me;
    }
}
export default PrintFile;
