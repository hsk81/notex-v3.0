import { DownloadManager } from "./ui/download-manager";
import { HeaderMenu } from "./ui/header-menu";
import { MdEditor } from "./ui/md-editor";
import { MdEditorFooter } from "./ui/md-editor-footer";
import { MdEditorAibar } from "./ui/md-editor-aibar";
import { MdEditorToolbarLhs } from "./ui/md-editor-toolbar-lhs";
import { MdEditorToolbarRhs } from "./ui/md-editor-toolbar-rhs";
import { PublishDialog } from "./ui/publish-dialog";

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
        this._markdown_editor = MdEditor.me;
        this._editor_toolbar_lhs = MdEditorToolbarLhs.me;
        this._editor_toolbar_rhs = MdEditorToolbarRhs.me;
        this._editor_aibar = MdEditorAibar.me;
        this._editor_footer = MdEditorFooter.me;
        this._publish_dialog = PublishDialog.me;
        this._download_manager = DownloadManager.me;
    }
    private readonly _header_menu: HeaderMenu;
    private readonly _markdown_editor: MdEditor;
    private readonly _editor_footer: MdEditorFooter;
    private readonly _editor_aibar: MdEditorAibar;
    private readonly _editor_toolbar_lhs: MdEditorToolbarLhs;
    private readonly _editor_toolbar_rhs: MdEditorToolbarRhs;
    private readonly _publish_dialog: PublishDialog;
    private readonly _download_manager: DownloadManager;
}

window['APP'] = App.me;
