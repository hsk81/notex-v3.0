import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";
import { Ui } from "../ui/index";

import { trace } from "../decorator/trace";

@trace
export class SmallerFontSize implements Command {
    public async redo() {
        const active = this.ui.$toolbarFontSizeSmaller.hasClass('active');
        this.template_dlg.fontSize = active ? 'smaller' : 'medium';
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
export default SmallerFontSize;
