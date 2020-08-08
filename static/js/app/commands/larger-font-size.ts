import { TemplateDialog } from "../components/dlg-template/index";
import { LhsEditor } from "../components/lhs-editor/index";
import { Command } from "./index";

import { trace } from "../decorator/trace";

@trace
export class LargerFontSize implements Command {
    public async redo() {
        const larger = this.template_dlg.fontSize === 'larger';
        this.template_dlg.fontSize = larger ? 'medium' : 'larger';
        await this.ed.render();
        return this;
    }
    private get template_dlg() {
        return TemplateDialog.me;
    }
    private get ed() {
        return LhsEditor.me;
    }
}
export default LargerFontSize;
