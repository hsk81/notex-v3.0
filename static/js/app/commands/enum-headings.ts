import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

export class EnumHeadings implements Command {
    public async redo() {
        this.template_dlg.enumHeadings = {
            h1: this.ui.$toolbarH1Enum.hasClass('active'),
            h2: this.ui.$toolbarH2Enum.hasClass('active'),
            h3: this.ui.$toolbarH3Enum.hasClass('active')
        };
        await this.ed.render();
        return this;
    }
    private get template_dlg() {
        return TemplateDialog.me;
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default EnumHeadings;
