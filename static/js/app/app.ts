import { DownloadController } from "./components/ctrl-download/index";
import { SessionController } from "./components/ctrl-session/index";
import { PublishDialog } from "./components/dlg-publish/index";
import { TemplateDialog } from "./components/dlg-template/index";

import { NavHeader } from "./components/nav-header/index";
import { LhsEditor } from "./components/lhs-editor/index";
import { LhsFooter } from "./components/lhs-footer/index";
import { RhsFooter } from "./components/rhs-footer/index";
import { LhsToolbar } from "./components/lhs-toolbar/index";
import { RhsToolbar } from "./components/rhs-toolbar/index";
import { KeyShortcuts } from "./components/key-shortcuts/index";

import { trace } from "./decorator/trace";
import "./string/random";

@trace
export class App {
    public static get me(): App {
        if (window.APP === undefined) {
            window.APP = new App();
        }
        return window.APP;
    }
    public constructor() {
        this.nav_header = NavHeader.me;
        this.md_editor = LhsEditor.me;
        this.lhs_toolbar = LhsToolbar.me;
        this.rhs_toolbar = RhsToolbar.me;
        this.rhs_footer = RhsFooter.me;
        this.lhs_footer = LhsFooter.me;
        this.publish_dialog = PublishDialog.me;
        this.template_dialog = TemplateDialog.me;
        this.key_shortcuts = KeyShortcuts.me;
        this.session_controller = SessionController.me;
        this.download_controller = DownloadController.me;
    }
    private readonly md_editor: LhsEditor;
    private readonly lhs_footer: LhsFooter;
    private readonly rhs_footer: RhsFooter;
    private readonly lhs_toolbar: LhsToolbar;
    private readonly rhs_toolbar: RhsToolbar;
    private readonly nav_header: NavHeader;
    private readonly publish_dialog: PublishDialog;
    private readonly template_dialog: TemplateDialog;
    private readonly key_shortcuts: KeyShortcuts;
    private readonly session_controller: SessionController;
    private readonly download_controller: DownloadController;
}
export default App.me;
