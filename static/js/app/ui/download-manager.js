var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../decorator/named", "../decorator/trace", "./header-menu"], function (require, exports, named_1, trace_1, header_menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DownloadManager_1;
    "use strict";
    let DownloadManager = DownloadManager_1 = class DownloadManager {
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = window['DOWNLOAD_MANAGER'] = new DownloadManager_1();
            }
            return this['_me'];
        }
        set title(title) {
            this.$downloadLink.attr("download", title);
        }
        set content(content) {
            this.$downloadLink.attr("href", URL.createObjectURL(new Blob([content], { type: 'text/markdown' })));
        }
        get $downloadLink() {
            return header_menu_1.default.me.$saveItem;
        }
    };
    DownloadManager = DownloadManager_1 = __decorate([
        trace_1.trace,
        named_1.named('DownloadManager')
    ], DownloadManager);
    exports.DownloadManager = DownloadManager;
    exports.default = DownloadManager;
});
//# sourceMappingURL=download-manager.js.map