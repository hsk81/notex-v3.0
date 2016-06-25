define(["require", "exports", './ui/header-menu/header-menu', './ui/markdown-editor/markdown-editor', './ui/publish-dialog/publish-dialog', './ui/download-manager/download-manager', './function/named', './function/partial', './function/with', './string/random'], function (require, exports, header_menu_1, markdown_editor_1, publish_dialog_1, download_manager_1) {
    "use strict";
    console.debug('[import:app.ts]');
    var App = (function () {
        function App() {
            this.headerMenu = header_menu_1.default.me;
            this.markdownEditor = markdown_editor_1.default.me;
            this.publishDialog = publish_dialog_1.default.me;
            this.downloadManager = download_manager_1.default.me;
        }
        Object.defineProperty(App, "me", {
            get: function () {
                return new App();
            },
            enumerable: true,
            configurable: true
        });
        return App;
    }());
    window.APP = App.me;
});
//# sourceMappingURL=app.js.map