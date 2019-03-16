import { DownloadManager } from "./ui/download-manager";
import { HeaderMenu } from "./ui/header-menu";
import { MdEditor } from "./ui/md-editor";
import { MdEditorFooter } from "./ui/md-editor-footer";
import { MdEditorToolbar } from "./ui/md-editor-toolbar";
import { PublishDialog } from "./ui/publish-dialog";

import { trace } from "./decorator/trace";

import "./function/named";
import "./function/partial";
import "./function/with";
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
        this._editorFooter = MdEditorFooter.me;
        this._publishDialog = PublishDialog.me;
        this._downloadManager = DownloadManager.me;
    }

    private _headerMenu: HeaderMenu;
    private _markdownEditor: MdEditor;
    private _editorFooter: MdEditorFooter;
    private _editorToolbar: MdEditorToolbar;
    private _publishDialog: PublishDialog;
    private _downloadManager: DownloadManager;
}

window['APP'] = App.me;
