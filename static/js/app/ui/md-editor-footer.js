var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", '../cookie/cookie', '../decorator/buffered', '../decorator/named', '../decorator/trace', './md-editor'], function (require, exports, cookie_1, buffered_1, named_1, trace_1, md_editor_1) {
    "use strict";
    console.debug('[import:app/ui/md-editor-footer.ts]');
    var MdEditorFooter = (function () {
        function MdEditorFooter() {
            this.urls = {
                '32x32': {
                    err: '/static/png/fatcow/32x32/spellcheck_error.png',
                    off: '/static/png/fatcow/32x32/spellcheck_gray.png',
                    on: '/static/png/fatcow/32x32/spellcheck.png'
                },
                '16x16': {
                    err: '/static/png/fatcow/16x16/spellcheck_error.png',
                    off: '/static/png/fatcow/16x16/spellcheck_gray.png',
                    on: '/static/png/fatcow/16x16/spellcheck.png'
                }
            };
            this.$mirror.tooltip({
                container: 'body', title: (function () {
                    return (this.ed.mirror ? 'Simple' : 'Advanced') + " Mode";
                }).bind(this)
            });
            this.$mirror
                .on('click', this.onMirrorClick.bind(this));
            this.$console
                .on('change', this.onConsoleChange.bind(this));
            this.$console
                .on('keydown', this.onConsoleKeyDown.bind(this));
            this.$spellCheckButton
                .on('click', this.onSpellCheckButtonClick.bind(this));
            if (this.ed.simple) {
                this.hide(600, true);
            }
            else {
                this.show(600, true);
            }
        }
        Object.defineProperty(MdEditorFooter, "me", {
            get: function () {
                if (this['_me'] === undefined) {
                    this['_me'] = window['MD_EDITOR_FOOTER'] = new MdEditorFooter();
                }
                return this['_me'];
            },
            enumerable: true,
            configurable: true
        });
        MdEditorFooter.prototype.hide = function (ms, fade) {
            if (ms === void 0) { ms = 200; }
            if (fade === void 0) { fade = false; }
            if (!this.ed.mirror) {
                this.$input.css({ 'height': '100%' });
            }
            if (fade) {
                this.$footer.hide();
                this.$footer.css({ 'width': '48px' });
                this.$footer.fadeIn(ms);
            }
            else {
                this.$footer.show();
                this.$footer.animate({ 'width': '48px' }, ms);
            }
            this.$console.val('');
        };
        MdEditorFooter.prototype.show = function (ms, fade) {
            if (ms === void 0) { ms = 200; }
            if (fade === void 0) { fade = false; }
            if (!this.ed.mirror) {
                this.$input.css({ 'height': 'calc(100% - 48px)' });
            }
            if (fade) {
                this.$footer.hide();
                this.$footer.css({ 'width': '100%' });
                this.$footer.fadeIn(ms);
            }
            else {
                this.$footer.show();
                this.$footer.animate({ 'width': '100%' }, ms);
            }
            this.$console.val('');
        };
        MdEditorFooter.prototype.onMirrorClick = function () {
            if (this.ed.mirror) {
                var scroll_1 = this.ed.mirror.getScrollInfo(), range = this.ed.mirror.listSelections()[0];
                var start = this.ed.mirror.indexFromPos(range.anchor), end = this.ed.mirror.indexFromPos(range.head);
                var $input = this.ed.toInput({
                    footer: true, toolbar: true
                });
                $input.show();
                $input.focus();
                $input.scrollLeft(scroll_1.left);
                $input.scrollTop(scroll_1.top);
                $input[0].setSelectionRange(Math.min(start, end), Math.max(start, end));
                this.$mirror.tooltip('hide');
                this.hide();
            }
            else {
                var scroll_2 = {
                    left: this.ed.$input.scrollLeft(),
                    top: this.ed.$input.scrollTop()
                }, sel = {
                    start: this.ed.$input[0].selectionStart,
                    end: this.ed.$input[0].selectionEnd
                };
                var mirror = this.ed.toMirror();
                mirror.focus();
                mirror.scrollTo(scroll_2.left, scroll_2.top);
                mirror.setSelection(mirror.posFromIndex(sel.start), mirror.posFromIndex(sel.end));
                this.$mirror.tooltip('hide');
                this.show();
            }
        };
        MdEditorFooter.prototype.onConsoleKeyDown = function (ev) {
            if (ev.key === 'Escape') {
                this.$console.val('');
                this.$console.trigger('change');
            }
        };
        MdEditorFooter.prototype.onConsoleChange = function (ev) {
            var $input = $(ev.target), value = $input.val();
            var rx_px = /^\//, mm_px = value.match(rx_px);
            var rx_sx = /\/[gimy]{0,4}$/, mm_sx = value.match(rx_sx);
            if (mm_px && mm_px.length > 0 && mm_sx && mm_sx.length > 0) {
                var rx_beg = mm_px[0].length, rx_end = value.length - mm_sx[0].length;
                var rx_flags = mm_sx[0].substring(1), rx_value = value.substring(rx_beg, rx_end);
                this.ed.search(new RegExp(rx_value, rx_flags));
            }
            else {
                this.ed.search(value);
            }
        };
        MdEditorFooter.prototype.onSpellCheckToggle = function (ev) {
            var _this = this;
            var $li1 = this.$spellCheckToggle, $li1_a = $li1.find('a'), $li1_img = $li1.find('img'), $li1_line2 = $li1.find('.line2');
            var $button_span = this.$spellCheckButton.find('span.img-placeholder');
            $button_span.remove();
            var $button_img = this.$spellCheckButton.find('img');
            $button_img.show();
            var lingua = {
                code: $li1_a.data('lingua'),
                charset: null
            };
            var state = $li1_a.data('state');
            if (state === 'off') {
                $button_img.prop('src', this.urls['16x16'].on);
            }
            else {
                $button_img.prop('src', this.urls['16x16'].off);
            }
            if (state === 'off') {
                $li1_a.data('state', 'on');
                $li1_img.prop('src', this.urls['32x32'].on);
                $li1_line2.text("On: Disable [" + lingua.code.replace('_', '-') + "]");
            }
            else {
                $li1_a.data('state', 'off');
                $li1_img.prop('src', this.urls['32x32'].off);
                $li1_line2.text("Off: Enable [" + lingua.code.replace('_', '-') + "]");
            }
            if (state !== 'off') {
                lingua.code = null;
            }
            this.$spellCheckButton.addClass('disabled');
            this.ed.spellCheck(lingua, function (error) {
                if (error) {
                    $button_img.prop('src', _this.urls['16x16'].off);
                }
                if (error) {
                    $li1_a.data('state', 'off');
                    $li1_img.prop('src', _this.urls['32x32'].off);
                    $li1_line2.text("Off: Enable [" + lingua.code.replace('_', '-') + "]");
                }
                if (!error) {
                    cookie_1.cookie.set('language', lingua.code);
                }
                _this.$spellCheckButton.removeClass('disabled');
            });
        };
        MdEditorFooter.prototype.onSpellCheckItemClick = function (ev) {
            var _this = this;
            var $li1 = this.$spellCheckToggle, $li1_a = $li1.find('a'), $li1_img = $li1.find('img'), $li1_line2 = $li1.find('.line2');
            var $lii = $(ev.target).closest('li'), $lii_a = $lii.find('a'), $lii_img = $lii.find('img');
            var url = $lii_img.prop('src'), code = cookie_1.cookie.get('language') ||
                (navigator.language || 'en-US').replace('-', '_'), lingua = {
                code: $lii_a.data('lingua'),
                charset: $lii_a.data('charset')
            };
            var $button = this.$spellCheckButton, $button_img = $button.find('img'), $button_span = $button.find('span.img-placeholder');
            $button_span.remove();
            $button_img.prop('src', url.replace('32x32', '16x16'));
            $button_img.show();
            this.$spellCheckButton.addClass('disabled');
            this.ed.spellCheck(lingua, function (error) {
                if (error) {
                    $button_img.prop('src', _this.urls['16x16'].err);
                }
                if (error) {
                    $li1_a.data('state', 'off');
                    $li1_a.data('lingua', code);
                    $li1_img.prop('src', _this.urls['32x32'].off);
                    $li1_line2.text("Off: Enable [" + code.replace('_', '-') + "]");
                }
                else {
                    $li1_a.data('state', 'on');
                    $li1_a.data('lingua', lingua.code);
                    $li1_img.prop('src', _this.urls['32x32'].on);
                    $li1_line2.text("On: Disable [" + lingua.code.replace('_', '-') + "]");
                }
                if (!error) {
                    cookie_1.cookie.set('language', lingua.code);
                }
                _this.$spellCheckButton.removeClass('disabled');
            });
        };
        MdEditorFooter.prototype.onSpellCheckButtonClick = function (ev) {
            var _this = this;
            var $menu = this.$spellCheckMenu, $spin = $menu.find('>.spin'), $item = $menu.find('>li');
            if ($item.length === 0) {
                $.get('/static/html/spell-check-menu.html').done(function (html) {
                    $menu.html(html);
                    $menu.append($spin);
                    $item = $menu.find('>li').hide();
                    $item.find('img').on('load', _this.onMenuItemLoad.bind(_this));
                    _this.$spellCheckToggle
                        .on('click', _this.onSpellCheckToggle.bind(_this));
                    _this.$spellCheckItem
                        .on('click', _this.onSpellCheckItemClick.bind(_this));
                    var code = cookie_1.cookie.get('language') ||
                        (navigator.language || 'en-US').replace('-', '_');
                    _this.$spellCheckToggle.find('a')
                        .data('lingua', code);
                    _this.$spellCheckToggle.find('a')
                        .data('state', 'off');
                    _this.$spellCheckToggle.find('.line2')
                        .text("Off: Enable [" + code.replace('_', '-') + "]");
                });
            }
        };
        MdEditorFooter.prototype.onMenuItemLoad = function (ev) {
            var $menu = this.$spellCheckMenu, $spin = $menu.find('>.spin'), $item = $menu.find('>li');
            $menu.removeClass('disabled');
            $item.fadeIn('slow');
            $spin.remove();
        };
        Object.defineProperty(MdEditorFooter.prototype, "$input", {
            get: function () {
                return $('#md-inp');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$footer", {
            get: function () {
                return $('div.lhs-footer');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$mirror", {
            get: function () {
                return this.$footer.find('.glyphicon-console').closest('button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$console", {
            get: function () {
                return this.$footer.find('#my-console').find('input');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$spellCheckMenu", {
            get: function () {
                return this.$footer.find('ul#spell-check-menu');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$spellCheckToggle", {
            get: function () {
                return this.$spellCheckMenu.find('li:first-of-type');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$spellCheckItem", {
            get: function () {
                return this.$spellCheckMenu.find('li:not(:first-of-type)');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "$spellCheckButton", {
            get: function () {
                return this.$footer.find('#spell-check-button');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MdEditorFooter.prototype, "ed", {
            get: function () {
                return md_editor_1.default.me;
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            buffered_1.buffered(600), 
            __metadata('design:type', Function), 
            __metadata('design:paramtypes', [Event]), 
            __metadata('design:returntype', void 0)
        ], MdEditorFooter.prototype, "onMenuItemLoad", null);
        MdEditorFooter = __decorate([
            trace_1.trace,
            named_1.named('MdEditorFooter'), 
            __metadata('design:paramtypes', [])
        ], MdEditorFooter);
        return MdEditorFooter;
    }());
    exports.MdEditorFooter = MdEditorFooter;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MdEditorFooter;
});
//# sourceMappingURL=md-editor-footer.js.map