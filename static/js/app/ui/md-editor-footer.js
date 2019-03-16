var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../cookie/cookie", "../decorator/buffered", "../decorator/named", "../decorator/trace", "./md-editor"], function (require, exports, cookie_1, buffered_1, named_1, trace_1, md_editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MdEditorFooter_1;
    "use strict";
    let MdEditorFooter = MdEditorFooter_1 = class MdEditorFooter {
        constructor() {
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
                    return `${this.ed.mirror ? 'Simple' : 'Advanced'} Mode`;
                }).bind(this)
            });
            this.$mirror
                .on('click', this.onMirrorClick.bind(this));
            this.$cli
                .on('change', this.onConsoleChange.bind(this));
            this.$cli
                .on('keydown', this.onConsoleKeyDown.bind(this));
            this.$spellCheckerButton
                .on('click', this.onSpellCheckButtonClick.bind(this));
            if (!this.ed.mobile) {
                if (!this.ed.simple) {
                    this.maximize(600, true);
                }
                else {
                    this.minimize(600, true);
                }
            }
            else {
                this.hide();
            }
        }
        static get me() {
            if (this['_me'] === undefined) {
                this['_me'] = window['MD_EDITOR_FOOTER'] = new MdEditorFooter_1();
            }
            return this['_me'];
        }
        hide() {
            if (!this.ed.mirror) {
                this.$input.css({ 'height': '100%' });
            }
            this.$footer.hide();
            this.$footer.css({ 'width': '48px' });
        }
        show() {
            if (!this.ed.mirror) {
                this.$input.css({ 'height': 'calc(100% - 48px)' });
            }
            this.$footer.show();
            this.$footer.css({ 'width': '100%' });
        }
        minimize(ms = 200, fade = false) {
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
        }
        maximize(ms = 200, fade = false) {
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
        }
        onMirrorClick() {
            if (this.ed.mirror) {
                let scroll = this.ed.mirror.getScrollInfo(), range = this.ed.mirror.listSelections()[0];
                let start = this.ed.mirror.indexFromPos(range.anchor), end = this.ed.mirror.indexFromPos(range.head);
                let $input = this.ed.toInput({
                    footer: true, toolbar: true
                });
                $input.show();
                $input.focus();
                $input.scrollLeft(scroll.left);
                $input.scrollTop(scroll.top);
                $input[0].setSelectionRange(Math.min(start, end), Math.max(start, end));
                this.$mirror.tooltip('hide');
                this.$cli.val('');
                this.minimize();
            }
            else {
                let scroll = {
                    left: this.ed.$input.scrollLeft(),
                    top: this.ed.$input.scrollTop()
                }, sel = {
                    start: this.ed.$input[0].selectionStart,
                    end: this.ed.$input[0].selectionEnd
                };
                let mirror = this.ed.toMirror();
                mirror.focus();
                mirror.scrollTo(scroll.left, scroll.top);
                mirror.setSelection(mirror.posFromIndex(sel.start), mirror.posFromIndex(sel.end));
                this.$mirror.tooltip('hide');
                this.$cli.val('');
                this.maximize();
            }
        }
        onConsoleKeyDown(ev) {
            if (ev.key === 'Escape') {
                this.$cli.val('');
                this.$cli.trigger('change');
            }
        }
        onConsoleChange(ev) {
            let $input = $(ev.target), value = $input.val();
            let rx_px = /^\//, mm_px = value.match(rx_px);
            let rx_sx = /\/[gimy]{0,4}$/, mm_sx = value.match(rx_sx);
            if (mm_px && mm_px.length > 0 && mm_sx && mm_sx.length > 0) {
                let rx_beg = mm_px[0].length, rx_end = value.length - mm_sx[0].length;
                let rx_flags = mm_sx[0].substring(1), rx_value = value.substring(rx_beg, rx_end);
                this.ed.search(new RegExp(rx_value, rx_flags));
            }
            else {
                this.ed.search(value);
            }
        }
        onSpellCheckToggle(ev) {
            let $li1 = this.$spellCheckerToggle, $li1_a = $li1.find('a'), $li1_img = $li1.find('img'), $li1_line2 = $li1.find('.line2');
            let $button_span = this.$spellCheckerButton.find('span.img-placeholder');
            $button_span.remove();
            let $button_img = this.$spellCheckerButton.find('img');
            $button_img.show();
            let lingua = {
                code: $li1_a.data('lingua'),
                charset: null
            };
            let state = $li1_a.data('state');
            if (state === 'off') {
                $button_img.prop('src', this.urls['16x16'].on);
            }
            else {
                $button_img.prop('src', this.urls['16x16'].off);
            }
            if (state === 'off') {
                $li1_a.data('state', 'on');
                $li1_img.prop('src', this.urls['32x32'].on);
                $li1_line2.text(`On: Disable [${lingua.code.replace('_', '-')}]`);
            }
            else {
                $li1_a.data('state', 'off');
                $li1_img.prop('src', this.urls['32x32'].off);
                $li1_line2.text(`Off: Enable [${lingua.code.replace('_', '-')}]`);
            }
            if (state !== 'off') {
                lingua.code = null;
            }
            this.$spellCheckerButton.addClass('disabled');
            this.ed.spellCheck(lingua, (error) => {
                if (error) {
                    $button_img.prop('src', this.urls['16x16'].off);
                }
                if (error) {
                    $li1_a.data('state', 'off');
                    $li1_img.prop('src', this.urls['32x32'].off);
                    $li1_line2.text(`Off: Enable [${lingua.code.replace('_', '-')}]`);
                }
                if (!error) {
                    cookie_1.cookie.set('language', lingua.code);
                }
                this.$spellCheckerButton.removeClass('disabled');
            });
        }
        onSpellCheckItemClick(ev) {
            let $li1 = this.$spellCheckerToggle, $li1_a = $li1.find('a'), $li1_img = $li1.find('img'), $li1_line2 = $li1.find('.line2');
            let $lii = $(ev.target).closest('li'), $lii_a = $lii.find('a'), $lii_img = $lii.find('img');
            let url = $lii_img.prop('src'), code = cookie_1.cookie.get('language') ||
                (navigator.language || 'en-US').replace('-', '_'), lingua = {
                code: $lii_a.data('lingua'),
                charset: $lii_a.data('charset')
            };
            let $button = this.$spellCheckerButton, $button_img = $button.find('img'), $button_span = $button.find('span.img-placeholder');
            $button_span.remove();
            $button_img.prop('src', url.replace('32x32', '16x16'));
            $button_img.show();
            this.$spellCheckerButton.addClass('disabled');
            this.ed.spellCheck(lingua, (error) => {
                if (error) {
                    $button_img.prop('src', this.urls['16x16'].err);
                }
                if (error) {
                    $li1_a.data('state', 'off');
                    $li1_a.data('lingua', code);
                    $li1_img.prop('src', this.urls['32x32'].off);
                    $li1_line2.text(`Off: Enable [${code.replace('_', '-')}]`);
                }
                else {
                    $li1_a.data('state', 'on');
                    $li1_a.data('lingua', lingua.code);
                    $li1_img.prop('src', this.urls['32x32'].on);
                    $li1_line2.text(`On: Disable [${lingua.code.replace('_', '-')}]`);
                }
                if (!error) {
                    cookie_1.cookie.set('language', lingua.code);
                }
                this.$spellCheckerButton.removeClass('disabled');
            });
        }
        onSpellCheckButtonClick(ev) {
            let $menu = this.$spellCheckerMenu, $spin = $menu.find('>.spin'), $item = $menu.find('>li');
            if ($item.length === 0) {
                $.get('/static/html/spell-checker-menu.html').done((html) => {
                    $menu.html(html);
                    $menu.append($spin);
                    $item = $menu.find('>li').hide();
                    $item.find('img').on('load', this.onMenuItemLoad.bind(this));
                    this.$spellCheckerToggle
                        .on('click', this.onSpellCheckToggle.bind(this));
                    this.$spellCheckerItem
                        .on('click', this.onSpellCheckItemClick.bind(this));
                    let code = this.normalize(cookie_1.cookie.get('language') ||
                        (navigator.language || 'en-US').replace('-', '_'));
                    this.$spellCheckerToggle.find('a')
                        .data('lingua', code);
                    this.$spellCheckerToggle.find('a')
                        .data('state', 'off');
                    this.$spellCheckerToggle.find('.line2')
                        .text(`Off: Enable [${code.replace('_', '-')}]`);
                });
            }
        }
        normalize(code) {
            const linguae_all = this.$spellCheckerMenu.find('>li>a')
                .map((i, li) => $(li).data('lingua'))
                .toArray();
            const linguae_std = this.$spellCheckerMenu.find('>li>a')
                .map((i, li) => $(li).data('standard') && $(li).data('lingua'))
                .toArray();
            const linguae_eql = linguae_all.filter((lingua) => {
                const split = lingua.toLowerCase().split('_');
                return split[0] === split[1];
            });
            if (linguae_all.indexOf(code) < 0) {
                const override = (lingua) => {
                    const lhs = lingua.split('_')[0];
                    const rhs = code.split('_')[0];
                    if (lhs === rhs) {
                        code = lingua;
                    }
                    return code !== lingua;
                };
                linguae_eql.every(override);
                linguae_std.every(override);
            }
            return code;
        }
        onMenuItemLoad(ev) {
            var $menu = this.$spellCheckerMenu, $spin = $menu.find('>.spin'), $item = $menu.find('>li');
            $menu.removeClass('disabled');
            $item.fadeIn('slow');
            $spin.remove();
        }
        get $input() {
            return $('#input');
        }
        get $footer() {
            return this.$input.siblings('.footer');
        }
        get $mirror() {
            return this.$footer.find('.glyphicon-console').closest('button');
        }
        get $cli() {
            return this.$footer.find('#cli').find('input');
        }
        get $spellCheckerButton() {
            return this.$footer.find('#spell-checker-button');
        }
        get $spellCheckerMenu() {
            return this.$footer.find('ul#spell-checker-menu');
        }
        get $spellCheckerToggle() {
            return this.$spellCheckerMenu.find('li:first-of-type');
        }
        get $spellCheckerItem() {
            return this.$spellCheckerMenu.find('li:not(:first-of-type)');
        }
        get ed() {
            return md_editor_1.default.me;
        }
    };
    __decorate([
        buffered_1.buffered(600),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], MdEditorFooter.prototype, "onMenuItemLoad", null);
    MdEditorFooter = MdEditorFooter_1 = __decorate([
        trace_1.trace,
        named_1.named('MdEditorFooter'),
        __metadata("design:paramtypes", [])
    ], MdEditorFooter);
    exports.MdEditorFooter = MdEditorFooter;
    exports.default = MdEditorFooter;
});
//# sourceMappingURL=md-editor-footer.js.map