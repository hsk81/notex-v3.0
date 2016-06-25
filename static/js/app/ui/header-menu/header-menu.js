define(["require", "exports"], function (require, exports) {
    "use strict";
    console.debug('[import:ui/header-menu.ts]');
    var HeaderMenu = (function () {
        function HeaderMenu() {
            this.$openItem.on('change', function (ev) {
                var files = ev.target.files;
                for (var i = 0; i < files.length; i++) {
                    if (files[i].type && files[i].type.match(/text/)) {
                        var reader = new FileReader();
                        reader.onload = function (progress_ev) {
                            var target = progress_ev.target;
                            if (target && target.readyState === 2 &&
                                typeof target.result === 'string') {
                                $('#md-inp')
                                    .val(target.result).trigger('change')
                                    .setCursorPosition(0).focus();
                            }
                        };
                        reader.readAsText(files[i]);
                    }
                }
            });
            this.$swapItem.on('click', function () {
                $('div.lhs').toggleClass('hidden-xs hidden-sm')
                    .toggleClass('col-xs-12 col-sm-12');
                $('div.rhs').toggleClass('hidden-xs hidden-sm')
                    .toggleClass('col-xs-12 col-sm-12');
            });
        }
        Object.defineProperty(HeaderMenu, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = new HeaderMenu();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderMenu.prototype, "$openItem", {
            get: function () {
                return $('#md-src,#md-src-mob');
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
        return HeaderMenu;
    }());
    exports.HeaderMenu = HeaderMenu;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HeaderMenu;
});
//# sourceMappingURL=header-menu.js.map