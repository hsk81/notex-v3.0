"use strict";
///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
console.debug('[import:app/ui/download-manager.ts]');
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var named_1 = require("../decorator/named");
var trace_1 = require("../decorator/trace");
var header_menu_1 = require("./header-menu");
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var DownloadManager = (function () {
    function DownloadManager() {
    }
    DownloadManager_1 = DownloadManager;
    Object.defineProperty(DownloadManager, "me", {
        get: function () {
            if (this['_me'] === undefined) {
                this['_me'] = window['DOWNLOAD_MANAGER'] = new DownloadManager_1();
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
    DownloadManager = DownloadManager_1 = __decorate([
        trace_1.trace,
        named_1.named('DownloadManager')
    ], DownloadManager);
    return DownloadManager;
    var DownloadManager_1;
}());
exports.DownloadManager = DownloadManager;
///////////////////////////////////////////////////////////////////////////////
exports.default = DownloadManager;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
