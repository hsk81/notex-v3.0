var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", './decorator/named', './decorator/trace', './ui/download-manager', './ui/header-menu', './ui/md-editor', 'ui/md-editor-toolbar', './ui/publish-dialog', './function/named', './function/partial', './function/with', './string/random'], function (require, exports, named_1, trace_1, download_manager_1, header_menu_1, md_editor_1, md_editor_toolbar_1, publish_dialog_1) {
    "use strict";
    console.debug('[import:app/app.ts]');
    var App = (function () {
        function App() {
            this._headerMenu = header_menu_1.default.me;
            this._markdownEditor = md_editor_1.default.me;
            this._editorToolbar = md_editor_toolbar_1.default.me;
            this._publishDialog = publish_dialog_1.default.me;
            this._downloadManager = download_manager_1.default.me;
        }
        Object.defineProperty(App, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new App();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        App = __decorate([
            trace_1.trace,
            named_1.named('App'), 
            __metadata('design:paramtypes', [])
        ], App);
        return App;
    }());
    window['APP'] = App.me;
});
//# sourceMappingURL=app.js.map