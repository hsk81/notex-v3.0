var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../decorator/mine", "../decorator/named", "../decorator/trace", "./md-editor", "./md-editor-toolbar"], function (require, exports, mine_1, named_1, trace_1, md_editor_1, md_editor_toolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderMenu_1;
    "use strict";
    let HeaderMenu = HeaderMenu_1 = class HeaderMenu {
        constructor() {
            this.$openItem
                .on('change', this.onOpenItemChange.bind(this));
            this.$swapItem
                .on('click', this.onSwapItemClick.bind(this));
        }
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = window['HEADER_MENU'] = new HeaderMenu_1();
            }
            return this['_me'];
        }
        onOpenItemChange(self, ev) {
            var files = ev.target.files;
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type || files[i].type.match(/text/)) {
                    let reader = new FileReader();
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
        }
        onSwapItemClick() {
            $('div.lhs').toggleClass('hidden-xs hidden-sm')
                .toggleClass('col-xs-12 col-sm-12');
            $('div.rhs').toggleClass('hidden-xs hidden-sm')
                .toggleClass('col-xs-12 col-sm-12');
            this.toolbar.refresh();
            this.editor.focus();
        }
        get $openItem() {
            return $('#source-bar,#source-mob');
        }
        get $saveItem() {
            return $('a[name=save]');
        }
        get $swapItem() {
            return $('[name=swap]');
        }
        get toolbar() {
            return md_editor_toolbar_1.default.me;
        }
        get editor() {
            return md_editor_1.default.me;
        }
    };
    __decorate([
        mine_1.mine,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], HeaderMenu.prototype, "onOpenItemChange", null);
    HeaderMenu = HeaderMenu_1 = __decorate([
        trace_1.trace,
        named_1.named('HeaderMenu'),
        __metadata("design:paramtypes", [])
    ], HeaderMenu);
    exports.HeaderMenu = HeaderMenu;
    exports.default = HeaderMenu;
});
//# sourceMappingURL=header-menu.js.map