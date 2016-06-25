define(["require", "exports", '../header-menu/header-menu'], function (require, exports, header_menu_1) {
    "use strict";
    console.debug('[import:ui/download-manager.ts]');
    var DownloadManager = (function () {
        function DownloadManager() {
        }
        Object.defineProperty(DownloadManager, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new DownloadManager();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DownloadManager.prototype, "title", {
            set: function (title) {
                this.$downloadLink.attr("download", title);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DownloadManager.prototype, "content", {
            set: function (content) {
                this.$downloadLink.attr("href", URL.createObjectURL(new Blob([content], { type: 'text/markdown' })));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DownloadManager.prototype, "$downloadLink", {
            get: function () {
                return header_menu_1.default.me.$saveItem;
            },
            enumerable: true,
            configurable: true
        });
        return DownloadManager;
    }());
    exports.DownloadManager = DownloadManager;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DownloadManager;
});
//# sourceMappingURL=download-manager.js.map