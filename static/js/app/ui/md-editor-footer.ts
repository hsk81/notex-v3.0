import { cookie } from "../cookie/cookie";
import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";

import { MdEditor } from "./md-editor";

declare const $: JQueryStatic;

@trace
export class MdEditorFooter {
    public static get me(this: any): MdEditorFooter {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_FOOTER'] = new MdEditorFooter();
        }
        return this['_me'];
    }

    public constructor() {
        this.$mirror.tooltip({
            container: 'body', title: (function (this: any) {
                return `${this.ed.mirror ? 'Simple' : 'Advanced'} Mode`;
            }).bind(this)
        });
        this.$mirror
            .on('click', this.onMirrorClick.bind(this));
        this.$cli
            .on('change', this.onConsoleChange.bind(this) as any);
        this.$cli
            .on('keydown', this.onConsoleKeyDown.bind(this) as any);
        this.$spellCheckerButton
            .on('click', this.onSpellCheckButtonClick.bind(this) as any);

        if (!this.ed.mobile) {
            if (!this.ed.simple) {
                this.maximize(600, true);
            } else {
                this.minimize(600, true);
            }
        } else {
            this.hide();
        }
    }

    private hide() {
        if (!this.ed.mirror) {
            this.$input.css({ 'height': '100%' });
        }
        this.$footer.hide();
        this.$footer.css({ 'width': '48px' });
    }

    private show() {
        if (!this.ed.mirror) {
            this.$input.css({ 'height': 'calc(100% - 48px)' });
        }
        this.$footer.show();
        this.$footer.css({ 'width': '100%' });
    }

    private minimize(ms: number = 200, fade: boolean = false) {
        if (!this.ed.mirror) {
            this.$input.css({ 'height': '100%' });
        }
        if (fade) {
            this.$footer.hide();
            this.$footer.css({ 'width': '48px' });
            this.$footer.fadeIn(ms);
        } else {
            this.$footer.show();
            this.$footer.animate({ 'width': '48px' }, ms);
        }
    }

    private maximize(ms: number = 200, fade: boolean = false) {
        if (!this.ed.mirror) {
            this.$input.css({ 'height': 'calc(100% - 48px)' });
        }
        if (fade) {
            this.$footer.hide();
            this.$footer.css({ 'width': '100%' });
            this.$footer.fadeIn(ms);
        } else {
            this.$footer.show();
            this.$footer.animate({ 'width': '100%' }, ms);
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
            this.$cli.val('');
            this.minimize();
        } else {
            let scroll = {
                left: this.ed.$input.scrollLeft(),
                top: this.ed.$input.scrollTop()
            }, sel = {
                start: (this.ed.$input[0] as HTMLInputElement).selectionStart,
                end: (this.ed.$input[0] as HTMLInputElement).selectionEnd
            };

            let mirror = this.ed.toMirror();
            mirror.focus();
            mirror.scrollTo(scroll.left, scroll.top);
            mirror.setSelection(
                mirror.posFromIndex(sel.start),
                mirror.posFromIndex(sel.end));

            this.$mirror.tooltip('hide');
            this.$cli.val('');
            this.maximize();
        }
    }

    private onConsoleKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.$cli.val('');
            this.$cli.trigger('change');
        }
    }

    private onConsoleChange(ev: KeyboardEvent) {
        let $input = $(ev.target as any),
            value = $input.val() as string;

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
        let $li1 = this.$spellCheckerToggle,
            $li1_a = $li1.find('a'),
            $li1_img = $li1.find('img'),
            $li1_line2 = $li1.find('.line2');

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
        } else {
            $button_img.prop('src', this.urls['16x16'].off);
        }
        if (state === 'off') {
            $li1_a.data('state', 'on');
            $li1_img.prop('src', this.urls['32x32'].on);
            $li1_line2.text(
                `On: Disable [${lingua.code.replace('_', '-')}]`);
        } else {
            $li1_a.data('state', 'off');
            $li1_img.prop('src', this.urls['32x32'].off);
            $li1_line2.text(
                `Off: Enable [${lingua.code.replace('_', '-')}]`);
        }
        if (state !== 'off') {
            lingua.code = null;
        }

        this.$spellCheckerButton.addClass('disabled');
        this.ed.spellCheck(lingua, (error: boolean) => {
            if (error) {
                $button_img.prop('src', this.urls['16x16'].off);
            }
            if (error) {
                $li1_a.data('state', 'off');
                $li1_img.prop('src', this.urls['32x32'].off);
                $li1_line2.text(
                    `Off: Enable [${lingua.code.replace('_', '-')}]`);
            }
            if (!error) {
                cookie.set('language', lingua.code)
            }
            this.$spellCheckerButton.removeClass('disabled');
        });
    }

    private onSpellCheckItemClick(ev: MouseEvent) {
        let $li1 = this.$spellCheckerToggle,
            $li1_a = $li1.find('a'),
            $li1_img = $li1.find('img'),
            $li1_line2 = $li1.find('.line2');
        let $lii = $(ev.target as any).closest('li'),
            $lii_a = $lii.find('a'),
            $lii_img = $lii.find('img');

        let url = $lii_img.prop('src'),
            code = cookie.get<string>('language') ||
                (navigator.language || 'en-US').replace('-', '_'),
            lingua = {
                code: $lii_a.data('lingua'),
                charset: $lii_a.data('charset')
            };

        let $button = this.$spellCheckerButton,
            $button_img = $button.find('img'),
            $button_span = $button.find('span.img-placeholder');

        $button_span.remove();
        $button_img.prop('src', url.replace('32x32', '16x16'));
        $button_img.show();

        this.$spellCheckerButton.addClass('disabled');
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
            this.$spellCheckerButton.removeClass('disabled');
        });
    }

    private onSpellCheckButtonClick(ev: MouseEvent) {
        let $menu = this.$spellCheckerMenu,
            $spin = $menu.find('>.spin'),
            $item = $menu.find('>li');
        if ($item.length === 0) {
            $.get('/static/html/spell-checker-menu.html').done((html) => {
                $menu.html(html);
                $menu.append($spin);
                $item = $menu.find('>li').hide();
                $item.find('img').on('load', this.onMenuItemLoad.bind(this));

                this.$spellCheckerToggle
                    .on('click', this.onSpellCheckToggle.bind(this) as any);
                this.$spellCheckerItem
                    .on('click', this.onSpellCheckItemClick.bind(this) as any);

                let code = this.normalize(cookie.get<string>('language') ||
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

    private normalize(code: string): string {
        const linguae_all: string[] = this.$spellCheckerMenu.find('>li>a')
            .map((i, li) => $(li).data('lingua'))
            .toArray() as any;

        const linguae_std: string[] = this.$spellCheckerMenu.find('>li>a')
            .map((i, li) => $(li).data('standard') && $(li).data('lingua'))
            .toArray() as any;

        const linguae_eql: string[] = linguae_all.filter((lingua) => {
            const split = lingua.toLowerCase().split('_');
            return split[0] === split[1];
        });

        if (linguae_all.indexOf(code) < 0) {
            const override = (lingua: string) => {
                const lhs = lingua.split('_')[0];
                const rhs = code.split('_')[0];
                if (lhs === rhs) {
                    code = lingua;
                }
                return code !== lingua;
            }
            linguae_eql.every(override);
            linguae_std.every(override);
        }

        return code;
    }

    @buffered(600)
    private onMenuItemLoad(ev: Event) {
        var $menu = this.$spellCheckerMenu,
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

    public get $input() {
        return $('#input');
    }

    private get $footer() {
        return this.$input.siblings('.footer');
    }

    private get $mirror() {
        return this.$footer.find('.glyphicon-console').closest('button');
    }

    private get $cli() {
        return this.$footer.find('#cli').find('input') as JQuery<HTMLElement>;
    }

    private get $spellCheckerButton() {
        return this.$footer.find('#spell-checker-button');
    }

    private get $spellCheckerMenu() {
        return this.$footer.find('ul#spell-checker-menu');
    }

    private get $spellCheckerToggle() {
        return this.$spellCheckerMenu.find('li:first-of-type');
    }

    private get $spellCheckerItem() {
        return this.$spellCheckerMenu.find('li:not(:first-of-type)');
    }

    private get ed() {
        return MdEditor.me;
    }
}

export default MdEditorFooter;
