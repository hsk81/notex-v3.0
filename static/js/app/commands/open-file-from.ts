import { LhsEditor } from "../components/lhs-editor/index";
import { trace } from "../decorator/trace";
import { Command } from "./index";

@trace
export class OpenFileFrom implements Command {
    public constructor(file: File) {
        this.file = file;
    }
    public redo() {
        return new Promise<Command>((resolve) => {
            if (!this.file.type || this.file.type.match(/text/)) {
                const reader = new FileReader();
                reader.onload = (progress_ev) => {
                    const target = progress_ev.target;
                    if (target && target.readyState === 2 &&
                        typeof target.result === 'string'
                    ) {
                        this.ed.setValue(target.result);
                        this.ed.render('hard').then(() => {
                            this.ed.focus();
                            resolve(this);
                        });
                    } else {
                        resolve(this);
                    }
                };
                reader.onerror = (progress_ev) => {
                    resolve(this);
                };
                reader.readAsText(this.file);
            } else {
                resolve(this);
            }
        });
    }
    private get ed() {
        return LhsEditor.me;
    }
    private file: File;
}
export default OpenFileFrom;
