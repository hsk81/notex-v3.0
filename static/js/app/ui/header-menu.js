var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../decorator/mine", "../decorator/trace", "./md-editor", "./md-editor-toolbar"], function (require, exports, mine_1, trace_1, md_editor_1, md_editor_toolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderMenu = /** @class */ (function () {
        function HeaderMenu() {
            this.$openItem
                .on('change', this.onOpenItemChange.bind(this));
            this.$swapItem
                .on('click', this.onSwapItemClick.bind(this));
        }
        HeaderMenu_1 = HeaderMenu;
        Object.defineProperty(HeaderMenu, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['HEADER_MENU'] = new HeaderMenu_1();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        HeaderMenu.prototype.onOpenItemChange = function (self, ev) {
            var files = ev.target.files;
            for (var i = 0; i < files.length; i++) {
                if (!files[i].type || files[i].type.match(/text/)) {
                    var reader = new FileReader();
                    reader.onload = function (progress_ev) {
                        var target = progress_ev.target;
                        if (target && target.readyState === 2 &&
                            typeof target.result === 'string') {
                            self.editor.setValue(target.result);
                            self.editor.focus();
                        }
                    };
                    reader.readAsText(files[i]);
                }
            }
        };
        HeaderMenu.prototype.onSwapItemClick = function () {
            $('div.lhs').toggleClass('hidden-xs hidden-sm')
                .toggleClass('col-xs-12 col-sm-12');
            $('div.rhs').toggleClass('hidden-xs hidden-sm')
                .toggleClass('col-xs-12 col-sm-12');
            this.toolbar.refresh();
            this.editor.focus();
        };
        Object.defineProperty(HeaderMenu.prototype, "$openItem", {
            get: function () {
                return $('#source-bar,#source-mob');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderMenu.prototype, "$saveItem", {
            get: function () {
                return $('a[name=save]');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderMenu.prototype, "$swapItem", {
            get: function () {
                return $('[name=swap]');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderMenu.prototype, "toolbar", {
            get: function () {
                return md_editor_toolbar_1.MdEditorToolbar.me;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderMenu.prototype, "editor", {
            get: function () {
                return md_editor_1.MdEditor.me;
            },
            enumerable: true,
            configurable: true
        });
        var HeaderMenu_1;
        __decorate([
            mine_1.mine,
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [Object, Object]),
            __metadata("design:returntype", void 0)
        ], HeaderMenu.prototype, "onOpenItemChange", null);
        HeaderMenu = HeaderMenu_1 = __decorate([
            trace_1.trace,
            __metadata("design:paramtypes", [])
        ], HeaderMenu);
        return HeaderMenu;
    }());
    exports.HeaderMenu = HeaderMenu;
    exports.default = HeaderMenu;
});
//# sourceMappingURL=header-menu.js.map