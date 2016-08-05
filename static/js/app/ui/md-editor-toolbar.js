var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../decorator/named', '../decorator/trace'], function (require, exports, named_1, trace_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-toolbar.ts]');
    var MdEditorToolbar = (function () {
        function MdEditorToolbar() {
            this._scroll = new IScroll('#md-wrap', {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
            $('.glyphicon-scissors').closest('button')
                .on('click', this.onScissorsClick.bind(this));
            $('.glyphicon-duplicate').closest('button')
                .on('click', this.onDuplicateClick.bind(this));
            $('.glyphicon-paste').closest('button')
                .on('click', this.onPasteClick.bind(this));
            $('.glyphicon-erase').closest('button')
                .on('click', this.onEraseClick.bind(this));
        }
        Object.defineProperty(MdEditorToolbar, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new MdEditorToolbar();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditorToolbar.prototype.refresh = function () {
            this._scroll.refresh();
        };
        MdEditorToolbar.prototype.onScissorsClick = function (ev) {
        };
        MdEditorToolbar.prototype.onDuplicateClick = function (ev) {
        };
        MdEditorToolbar.prototype.onPasteClick = function (ev) {
        };
        MdEditorToolbar.prototype.onEraseClick = function (ev) {
        };
        MdEditorToolbar = __decorate([
            trace_1.trace,
            named_1.named('MdEditorToolbar'), 
            __metadata('design:paramtypes', [])
        ], MdEditorToolbar);
        return MdEditorToolbar;
    }());
    exports.MdEditorToolbar = MdEditorToolbar;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MdEditorToolbar;
});
//# sourceMappingURL=md-editor-toolbar.js.map