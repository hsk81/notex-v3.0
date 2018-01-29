"use strict";
///////////////////////////////////////////////////////////////////////////////
///<reference path="./global/global.d.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
console.debug('[import:app/app.ts]');
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var download_manager_1 = require("./ui/download-manager");
var header_menu_1 = require("./ui/header-menu");
var md_editor_1 = require("./ui/md-editor");
var md_editor_footer_1 = require("ui/md-editor-footer");
var md_editor_toolbar_1 = require("ui/md-editor-toolbar");
var publish_dialog_1 = require("./ui/publish-dialog");
var named_1 = require("./decorator/named");
var trace_1 = require("./decorator/trace");
require("./function/named");
require("./function/partial");
require("./function/with");
require("./string/random");
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var App = (function () {
    function App() {
        this._headerMenu = header_menu_1.default.me;
        this._markdownEditor = md_editor_1.default.me;
        this._editorToolbar = md_editor_toolbar_1.default.me;
        this._editorFooter = md_editor_footer_1.default.me;
        this._publishDialog = publish_dialog_1.default.me;
        this._downloadManager = download_manager_1.default.me;
    }
    App_1 = App;
    Object.defineProperty(App, "me", {
        get: function () {
            if (this['_me'] === undefined) {
                this['_me'] = window['APP'] = new App_1();
            }
            return this['_me'];
        },
        enumerable: true,
        configurable: true
    });
    App = App_1 = __decorate([
        trace_1.trace,
        named_1.named('App')
    ], App);
    return App;
    var App_1;
}());
exports.App = App;
///////////////////////////////////////////////////////////////////////////////
window['APP'] = App.me;
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
