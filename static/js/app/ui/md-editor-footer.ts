///////////////////////////////////////////////////////////////////////////////
///<reference path="../global/global.d.ts"/>

console.debug('[import:app/ui/md-editor-footer.ts]');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import {cookie} from '../cookie/cookie';

import {buffered} from '../decorator/buffered';
import {named} from '../decorator/named';
import {trace} from '../decorator/trace';

import MdEditor from './md-editor';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@trace
@named('MdEditorFooter')
export class MdEditorFooter {
    public static get me(): MdEditorFooter {
        if (this['_me'] === undefined) {
            this['_me'] = new MdEditorFooter();
        }
        return this['_me'];
    }

    public constructor() {
        this.$mirror.tooltip({
            container: 'body', title: (function () {
                return `${this.ed.mirror ? 'Simple' : 'Advanced'} Mode`;
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
        if (!this.ed.simple) {
            this.$spellCheckButton.removeClass('disabled');
            this.$console.prop('disabled', false);
        } else {
            this.$spellCheckButton.addClass('disabled');
            this.$console.prop('disabled', true);
        }
    }

    private onMirrorClick() {
        if (this.ed.mirror) {
            let scroll = this.ed.mirror.getScrollInfo(),
                range = this.ed.mirror.listSelections()[0];
            let start = this.ed.mirror.indexFromPos(range.anchor),
                end = this.ed.mirror.indexFromPos(range.head);

            let $input = this.ed.toInput({
                footer: true, toolbar: true
            });

            $input.show();
            $input.focus();
            $input.scrollLeft(scroll.left);
            $input.scrollTop(scroll.top);
            $input[0].setSelectionRange(
                Math.min(start, end), Math.max(start, end));

            this.$mirror.tooltip('hide');
            this.$spellCheckButton.addClass('disabled');
            this.$console.prop('disabled', true);
            this.$console.val('');
        } else {
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
            mirror.setSelection(
                mirror.posFromIndex(sel.start),
                mirror.posFromIndex(sel.end));

            this.$mirror.tooltip('hide');
            this.$spellCheckButton.removeClass('disabled');
            this.$console.prop('disabled', false);
        }
    }

    private onConsoleKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.$console.val('');
            this.$console.trigger('change');
        }
    }

    private onConsoleChange(ev: KeyboardEvent) {
        let $input = $(ev.target),
            value = $input.val();

        let rx_px = /^\//,
            mm_px = value.match(rx_px);
        let rx_sx = /\/[gimy]{0,4}$/,
            mm_sx = value.match(rx_sx);

        if (mm_px && mm_px.length > 0 && mm_sx && mm_sx.length > 0) {
            let rx_beg = mm_px[0].length,
                rx_end = value.length - mm_sx[0].length;
            let rx_flags = mm_sx[0].substring(1),
                rx_value = value.substring(rx_beg, rx_end);

            this.ed.search(new RegExp(rx_value, rx_flags));
        } else {
            this.ed.search(value);
        }
    }

    private onSpellCheckToggle(ev: MouseEvent) {
        let $li1 = this.$spellCheckToggle,
            $li1_a = $li1.find('a'),
            $li1_img = $li1.find('img'),
            $li1_line2 = $li1.find('.line2');

        let $button_span = this.$spellCheckButton.find('span.img-placeholder');
        $button_span.remove();
        let $button_img = this.$spellCheckButton.find('img');
        $button_img.show();

        let lingua = {
            code: $li1_a.data('lingua'),
            charset: null
        };

        let state = $li1_a.data('state');
        if (state === 'off') {
            $button_img.prop('src',  this.urls['16x16'].on);
        } else {
            $button_img.prop('src',  this.urls['16x16'].off);
        }
        if (state === 'off') {
            $li1_a.data('state', 'on');
            $li1_img.prop('src',  this.urls['32x32'].on);
            $li1_line2.text(
                `On: Disable [${lingua.code.replace('_', '-')}]`);
        } else {
            $li1_a.data('state', 'off');
            $li1_img.prop('src',  this.urls['32x32'].off);
            $li1_line2.text(
                `Off: Enable [${lingua.code.replace('_', '-')}]`);
        }
        if (state !== 'off') {
            lingua.code = null;
        }

        this.$spellCheckButton.addClass('disabled');
        this.ed.spellCheck(lingua, (error: boolean) => {
            if (error) {
                $button_img.prop('src',  this.urls['16x16'].off);
            }
            if (error) {
                $li1_a.data('state', 'off');
                $li1_img.prop('src',  this.urls['32x32'].off);
                $li1_line2.text(
                    `Off: Enable [${lingua.code.replace('_', '-')}]`);
            }
            if (!error) {
                cookie.set('language', lingua.code)
            }
            this.$spellCheckButton.removeClass('disabled');
        });
    }

    private onSpellCheckItemClick(ev: MouseEvent) {
        let $li1 = this.$spellCheckToggle,
            $li1_a = $li1.find('a'),
            $li1_img = $li1.find('img'),
            $li1_line2 = $li1.find('.line2');
        let $lii = $(ev.target).closest('li'),
            $lii_a = $lii.find('a'),
            $lii_img = $lii.find('img');

        let url = $lii_img.prop('src'),
            code = cookie.get<string>('language') ||
                (navigator.language || 'en-US').replace('-', '_'),
            lingua = {
                code: $lii_a.data('lingua'),
                charset: $lii_a.data('charset')
            };

        let $button = this.$spellCheckButton,
            $button_img = $button.find('img'),
            $button_span = $button.find('span.img-placeholder');

        $button_span.remove();
        $button_img.prop('src', url.replace('32x32', '16x16'));
        $button_img.show();

        this.$spellCheckButton.addClass('disabled');
        this.ed.spellCheck(lingua, (error: boolean) => {
            if (error) {
                $button_img.prop('src', this.urls['16x16'].err);
            }
            if (error) {
                $li1_a.data('state', 'off');
                $li1_a.data('lingua', code);
                $li1_img.prop('src', this.urls['32x32'].off);
                $li1_line2.text(
                    `Off: Enable [${code.replace('_', '-')}]`);
            } else {
                $li1_a.data('state', 'on');
                $li1_a.data('lingua', lingua.code);
                $li1_img.prop('src', this.urls['32x32'].on);
                $li1_line2.text(
                    `On: Disable [${lingua.code.replace('_', '-')}]`);
            }
            if (!error) {
                cookie.set('language', lingua.code)
            }
            this.$spellCheckButton.removeClass('disabled');
        });
    }

    private onSpellCheckButtonClick(ev: MouseEvent) {
        var $menu = this.$spellCheckMenu,
            $spin = $menu.find('>.spin'),
            $item = $menu.find('>li');
        if ($item.length === 0) {
            $.get('/static/html/spell-check-menu.html').done((html) => {
                $menu.html(html);
                $menu.append($spin);
                $item = $menu.find('>li').hide();
                $item.find('img').on('load', this.onMenuItemLoad.bind(this));

                this.$spellCheckToggle
                    .on('click', this.onSpellCheckToggle.bind(this));
                this.$spellCheckItem
                    .on('click', this.onSpellCheckItemClick.bind(this));

                let code = cookie.get<string>('language') ||
                    (navigator.language || 'en-US').replace('-', '_');
                this.$spellCheckToggle.find('a')
                    .data('lingua', code);
                this.$spellCheckToggle.find('a')
                    .data('state', 'off');
                this.$spellCheckToggle.find('.line2')
                    .text(`Off: Enable [${code.replace('_', '-')}]`);
            });
        }
    }

    @buffered(600)
    private onMenuItemLoad(ev: Event) {
        var $menu = this.$spellCheckMenu,
            $spin = $menu.find('>.spin'),
            $item = $menu.find('>li');

        $menu.removeClass('disabled');
        $item.fadeIn('slow');
        $spin.remove();
    }

    private urls: any = {
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

    private get $mirror() {
        return $('.glyphicon-console').closest('button');
    }

    private get $console() {
        return $('#my-console').find('input');
    }

    private get $spellCheckMenu() {
        return $('ul#spell-check-menu');
    }

    private get $spellCheckToggle() {
        return this.$spellCheckMenu.find('li:first-of-type');
    }

    private get $spellCheckItem() {
        return this.$spellCheckMenu.find('li:not(:first-of-type)');
    }

    private get $spellCheckButton() {
        return $('#spell-check-button');
    }

    private get ed() {
        return MdEditor.me;
    }
}

///////////////////////////////////////////////////////////////////////////////

export default MdEditorFooter;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
