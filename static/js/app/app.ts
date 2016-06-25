///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.debug('[import:app.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import './function/named';
import './function/partial';
import './function/with';
import './string/random';

///////////////////////////////////////////////////////////////////////////////

import HeaderMenu from './ui/header-menu';
import MarkdownEditor from './ui/markdown-editor';
import PublishDialog from './ui/publish-dialog';
import DownloadManager from './ui/download-manager';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class App {
    static get me():App {
        return new App();
    }

    constructor() {
        this.headerMenu = HeaderMenu.me;
        this.markdownEditor = MarkdownEditor.me;
        this.publishDialog = PublishDialog.me;
        this.downloadManager = DownloadManager.me;
    }

    private headerMenu:HeaderMenu;
    private markdownEditor:MarkdownEditor;
    private publishDialog:PublishDialog;
    private downloadManager: DownloadManager;
}

///////////////////////////////////////////////////////////////////////////////

interface Window {
    APP:App;
}

declare let window:Window;
window.APP = App.me;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
