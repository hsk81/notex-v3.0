import { TemplateDialog } from "../components/dlg-template/index";
import { Alignment } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";

export class AlignText implements Command {
    constructor(alignment: Alignment) {
        this.alignment = alignment;
    }
    public async redo() {
        this.template_dlg.alignment = this.alignment;
        await this.ed.render();
        return this;
    }
    private get template_dlg() {
        return TemplateDialog.me;
    }
    private get ed() {
        return LhsEditor.me;
    }
    alignment: Alignment;
}
export default AlignText;
