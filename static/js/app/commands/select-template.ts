import { TemplateDialog } from "../components/dlg-template/index";
import { Template } from "../components/dlg-template/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class SelectTemplate implements Command {
    constructor(template?: Template) {
        this.template = template;
    }
    public async redo() {
        if (this.template) {
            await this.template_dlg.select(this.template);
        } else {
            this.ui.$templateDialog.modal();
        }
        return this;
    }
    private get template_dlg() {
        return TemplateDialog.me;
    }
    private get ui() {
        return Ui.me;
    }
    private template?: Template;
}
export default SelectTemplate;
