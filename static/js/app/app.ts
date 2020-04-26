import { DownloadManager } from "./ui/manager-download";
import { PublishManager } from "./ui/manager-publish";
import { TemplateManager } from "./ui/manager-template";

import { HeaderMenu } from "./ui/header-menu";
import { MdEditor } from "./ui/md-editor";
import { MdEditorFooter } from "./ui/md-editor-footer";
import { MdEditorAibar } from "./ui/md-editor-aibar";
import { MdEditorToolbarLhs } from "./ui/md-editor-toolbar-lhs";
import { MdEditorToolbarRhs } from "./ui/md-editor-toolbar-rhs";

import { trace } from "./decorator/trace";
import "./string/random";

@trace
export class App {
    public static get me(this: any): App {
        if (this['_me'] === undefined) {
            this['_me'] = window['APP'] = new App();
        }
        return this['_me'];
    }
    public constructor() {
        this._header_menu = HeaderMenu.me;
        this._editor = MdEditor.me;
        this._editor_toolbar_lhs = MdEditorToolbarLhs.me;
        this._editor_toolbar_rhs = MdEditorToolbarRhs.me;
        this._editor_aibar = MdEditorAibar.me;
        this._editor_footer = MdEditorFooter.me;
        this._manager_download = DownloadManager.me;
        this._manager_publish = PublishManager.me;
        this._manager_template = TemplateManager.me;
    }
    private readonly _editor: MdEditor;
    private readonly _editor_footer: MdEditorFooter;
    private readonly _editor_aibar: MdEditorAibar;
    private readonly _editor_toolbar_lhs: MdEditorToolbarLhs;
    private readonly _editor_toolbar_rhs: MdEditorToolbarRhs;
    private readonly _header_menu: HeaderMenu;
    private readonly _manager_publish: PublishManager;
    private readonly _manager_template: TemplateManager;
    private readonly _manager_download: DownloadManager;
}

window['APP'] = App.me;
