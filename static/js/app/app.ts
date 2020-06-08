import { DownloadManager } from "./ui/manager-download";
import { PublishDialog } from "./components/dlg-publish/index";
import { TemplateDialog } from "./components/dlg-template/index";

import { NavHeader } from "./components/nav-header/index";
import { MdEditor } from "./ui/md-editor";
import { LhsFooter } from "./components/lhs-footer/index";
import { RhsFooter } from "./components/rhs-footer/index";
import { LhsToolbar } from "./components/lhs-toolbar/index";
import { RhsToolbar } from "./components/rhs-toolbar/index";

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
        this.editor = MdEditor.me;
        this.lhs_toolbar = LhsToolbar.me;
        this.rhs_toolbar = RhsToolbar.me;
        this.rhs_footer = RhsFooter.me;
        this.lhs_footer = LhsFooter.me;
        this.download_manager = DownloadManager.me;
        this.publish_dialog = PublishDialog.me;
        this.template_dialog = TemplateDialog.me;
    }
    private readonly editor: MdEditor;
    private readonly lhs_footer: LhsFooter;
    private readonly rhs_footer: RhsFooter;
    private readonly lhs_toolbar: LhsToolbar;
    private readonly rhs_toolbar: RhsToolbar;
    private readonly nav_header: NavHeader;
    private readonly publish_dialog: PublishDialog;
    private readonly template_dialog: TemplateDialog;
    private readonly download_manager: DownloadManager;
}
export default App.me;
