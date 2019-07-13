import { DownloadManager } from "./ui/download-manager";
import { HeaderMenu } from "./ui/header-menu";
import { MdEditor } from "./ui/md-editor";
import { MdEditorFooter } from "./ui/md-editor-footer";
import { MdEditorAibar } from "./ui/md-editor-aibar";
import { MdEditorToolbar } from "./ui/md-editor-toolbar";
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
        this._headerMenu = HeaderMenu.me;
        this._markdownEditor = MdEditor.me;
        this._editorToolbar = MdEditorToolbar.me;
        this._editorAibar = MdEditorAibar.me;
        this._editorFooter = MdEditorFooter.me;
        this._publishDialog = PublishDialog.me;
        this._downloadManager = DownloadManager.me;
    }
    private readonly _headerMenu: HeaderMenu;
    private readonly _markdownEditor: MdEditor;
    private readonly _editorFooter: MdEditorFooter;
    private readonly _editorAibar: MdEditorAibar;
    private readonly _editorToolbar: MdEditorToolbar;
    private readonly _publishDialog: PublishDialog;
    private readonly _downloadManager: DownloadManager;
}

window['APP'] = App.me;
