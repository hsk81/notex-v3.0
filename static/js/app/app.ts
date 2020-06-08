import { DownloadManager } from "./ui/manager-download";
import { PublishManager } from "./ui/manager-publish";
import { TemplateManager } from "./ui/manager-template";

import { HeaderMenu } from "./ui/header-menu";
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
        this.header_menu = HeaderMenu.me;
        this.editor = MdEditor.me;
        this.lhs_toolbar = LhsToolbar.me;
        this.rhs_toolbar = RhsToolbar.me;
        this.rhs_footer = RhsFooter.me;
        this.lhs_footer = LhsFooter.me;
        this.download_manager = DownloadManager.me;
        this.publish_manager = PublishManager.me;
        this.template_manager = TemplateManager.me;
    }
    private readonly editor: MdEditor;
    private readonly lhs_footer: LhsFooter;
    private readonly rhs_footer: RhsFooter;
    private readonly lhs_toolbar: LhsToolbar;
    private readonly rhs_toolbar: RhsToolbar;
    private readonly header_menu: HeaderMenu;
    private readonly publish_manager: PublishManager;
    private readonly template_manager: TemplateManager;
    private readonly download_manager: DownloadManager;
}
export default App.me;
