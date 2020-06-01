import { MdEditor } from "./md-editor";
import { UiMode } from "./ui-mode";
import { Ui } from "./ui";

import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";
import { cookie } from "../cookie/cookie";

declare const $: JQueryStatic;

@trace
export class MdEditorFooter {
    public static get me() {
        if (window.MD_EDITOR_FOOTER === undefined) {
            window.MD_EDITOR_FOOTER = new MdEditorFooter();
        }
        return window.MD_EDITOR_FOOTER;
    }
    public constructor() {
        if (!this.ed.mobile) {
            if (this.ed.uiMode !== UiMode.simple) {
                this.show();
            } else {
                this.hide();
            }
        } else {
            this.hide(true);
        }
        this.events();
        this.tips();
    }
    private show() {
        this.ui.$lhs.removeClass('without-footer');
        this.ui.$footer.fadeIn('slow');
    }
    private hide(force = false) {
        this.ui.$lhs.addClass('without-footer');
        if (force) this.ui.$footer.hide();
    }
    private events() {
        this.ui.$footer.find('[data-toggle="popover"]')
            .on('blur', (ev) => $(ev.target).popover('hide'))
            .on('click', (ev) => $(ev.target).popover('toggle'))
            .on('keydown', (ev) => $(ev.target).popover('hide'))
            .on('keypress', (ev) => $(ev.target).popover('hide'));
        this.ui.$footerMirror
            .on('click', this.onMirrorClick.bind(this));
        this.ui.$footerCliFind
            .on('change', this.onFindChange.bind(this) as any);
        this.ui.$footerCliFind
            .on('keydown', this.onFindKeyDown.bind(this) as any);
        this.ui.$footerCliFindNext
            .on('click', this.onFindNextClick.bind(this) as any);
        this.ui.$footerCliFindPrevious
            .on('click', this.onFindPreviousClick.bind(this) as any);
        this.ui.$footerCliReplace
            .on('change', this.onReplaceChange.bind(this) as any);
        this.ui.$footerCliReplace
            .on('keydown', this.onReplaceKeyDown.bind(this) as any);
        this.ui.$footerCliReplaceConfirm
            .on('click', this.onReplaceConfirmClick.bind(this) as any);
        this.ui.$footerSpellCheckerButton
            .on('click', this.onSpellCheckButtonClick.bind(this) as any);
    }
    private tips() {
        this.ui.$footer.find('[data-toggle="tooltip"]').tooltip({
            trigger: 'hover'
        });
        this.ui.$footer.find('[data-toggle="dropdown"]').tooltip({
            trigger: 'hover'
        });
        this.ui.$footer.find('[data-toggle="popover"]').popover({
            trigger: 'manual'
        })
        this.ui.$footerMirror.tooltip({
            container: 'body', title: (function (this: any) {
                return `${this.ed.mirror ? 'Simple' : 'Advanced'} Mode`;
            }).bind(this)
        });
    }
    private onMirrorClick() {
        if (this.ed.mirror) {
            const scroll = this.ed.mirror.getScrollInfo();
            const range = this.ed.mirror.listSelections()[0];
            const start = this.ed.mirror.indexFromPos(range.anchor);
            const end = this.ed.mirror.indexFromPos(range.head);
            const $input = this.ed.toInput({
                footer: true
            });
            $input.show();
            $input.focus();
            $input.scrollLeft(scroll.left);
            $input.scrollTop(scroll.top);
            $input[0].setSelectionRange(
                Math.min(start, end), Math.max(start, end)
            );
            this.ui.$footerMirror.tooltip('hide');
            this.ui.$footerCliFind.val('');
            this.hide();
        } else {
            const scroll = {
                left: this.ui.$input.scrollLeft(),
                top: this.ui.$input.scrollTop()
            };
            const selection = {
                start: (this.ui.$input[0] as HTMLInputElement).selectionStart,
                end: (this.ui.$input[0] as HTMLInputElement).selectionEnd
            };
            const mirror = this.ed.toMirror();
            mirror.focus();
            mirror.scrollTo(scroll.left, scroll.top);
            mirror.setSelection(
                mirror.posFromIndex(selection.start),
                mirror.posFromIndex(selection.end)
            );
            this.ui.$footerMirror.tooltip('hide');
            this.ui.$footerCliFind.val('');
            this.show();
        }
    }
    @buffered(40)
    private onFindKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.ui.$footerCliFind.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            });
            this.ui.$footerCliFind.val('');
        }
        if (ev.key === 'Enter') {
            this.ui.$footerCliFind.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            });
        }
    }
    private onFindNextClick(ev: KeyboardEvent) {
        this.ui.$footerCliFind.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            shiftKey: false
        });
    }
    private onFindPreviousClick(ev: KeyboardEvent) {
        this.ui.$footerCliFind.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            shiftKey: true
        });
    }
    @buffered(40)
    private onReplaceKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.ui.$footerCliReplace.val('');
        }
        if (ev.key === 'Enter') {
            this.ui.$footerCliReplace.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                shiftKey: ev.shiftKey
            });
        }
    }
    private onReplaceConfirmClick(ev: KeyboardEvent) {
        this.ui.$footerCliReplace.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            shiftKey: ev.shiftKey
        });
    }
    private onFindChange(ev: KeyboardEvent, extra?: {
        key: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean
    }) {
        if (extra === undefined) {
            return;
        }
        switch (extra.key) {
            case 'Escape': break;
            case 'Enter': break;
            default: return;
        }
        const $find = $(ev.target as any);
        const value = $find.val() as string;
        const rx_px = /^\//;
        const mm_px = value.match(rx_px);
        const rx_sx = /\/[gimy]{0,4}$/;
        const mm_sx = value.match(rx_sx);
        if (mm_px && mm_px.length > 0 && mm_sx && mm_sx.length > 0) {
            const rx_beg = mm_px[0].length;
            const rx_end = value.length - mm_sx[0].length;
            const rx_flags = mm_sx[0].substring(1);
            const rx_value = value.substring(rx_beg, rx_end);
            this.ed.search(new RegExp(rx_value, rx_flags), extra);
        } else {
            this.ed.search(value, extra);
        }
    }
    private onReplaceChange(ev: KeyboardEvent, extra?: {
        key: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean
    }) {
        if (extra === undefined) {
            return;
        }
        switch (extra.key) {
            case 'Escape': break;
            case 'Enter': break;
            default: return;
        }
        const $find = this.ui.$footerCliFind;
        const old_value = $find.val() as string;
        const $replace = $(ev.target as any);
        const new_value = $replace.val() as string;
        const rx_px = /^\//;
        const mm_px = old_value.match(rx_px);
        const rx_sx = /\/[gimy]{0,4}$/;
        const mm_sx = old_value.match(rx_sx);
        if (mm_px && mm_px.length > 0 && mm_sx && mm_sx.length > 0) {
            const rx_beg = mm_px[0].length;
            const rx_end = old_value.length - mm_sx[0].length;
            const rx_flags = mm_sx[0].substring(1);
            const rx_value = old_value.substring(rx_beg, rx_end);
            this.ed.replace(new RegExp(rx_value, rx_flags), new_value, extra);
        } else if (old_value) {
            this.ed.replace(old_value, new_value, extra);
        }
    }
    private onSpellCheckToggle(ev: MouseEvent) {
        const $li1 = this.ui.$footerSpellCheckerToggle;
        const $li1_a = $li1.find('a');
        const $li1_img = $li1.find('img');
        const $li1_line2 = $li1.find('.line2');
        const $button_span = this.ui.$footerSpellCheckerButton.find('span.img-placeholder');
        $button_span.remove();
        const $button_img = this.ui.$footerSpellCheckerButton.find('img');
        $button_img.show();
        const lingua = {
            code: $li1_a.data('lingua'),
            charset: null
        };
        const state = $li1_a.data('state');
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
        this.ui.$footerSpellCheckerButton.addClass('disabled');
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
            this.ui.$footerSpellCheckerButton.removeClass('disabled');
        });
    }
    private onSpellCheckItemClick(ev: MouseEvent) {
        const $li1 = this.ui.$footerSpellCheckerToggle;
        const $li1_a = $li1.find('a');
        const $li1_img = $li1.find('img');
        const $li1_line2 = $li1.find('.line2');
        const $lii = $(ev.target as any).closest('li');
        const $lii_a = $lii.find('a');
        const $lii_img = $lii.find('img');
        const url = $lii_img.prop('src');
        const code = cookie.get<string>('language') ||
            (navigator.language || 'en-US').replace('-', '_');
        const lingua = {
            code: $lii_a.data('lingua'),
            charset: $lii_a.data('charset')
        };
        const $button = this.ui.$footerSpellCheckerButton;
        const $button_img = $button.find('img');
        const $button_span = $button.find('span.img-placeholder');
        $button_span.remove();
        $button_img.prop('src', url.replace('32x32', '16x16'));
        $button_img.show();
        this.ui.$footerSpellCheckerButton.addClass('disabled');
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
            this.ui.$footerSpellCheckerButton.removeClass('disabled');
        });
    }
    private onSpellCheckButtonClick(ev: JQuery.ClickEvent) {
        const $menu = this.ui.$footerSpellCheckerMenu;
        const $spin = $menu.find('>.spin');
        let $item = $menu.find('>li');
        if ($item.length === 0) {
            $.get('/static/html/spell-checker-menu.html').done((html) => {
                $menu.html(html);
                $menu.append($spin);
                $item = $menu.find('>li').hide();
                $item.find('img').on('load', this.onMenuItemLoad.bind(this));

                this.ui.$footerSpellCheckerToggle
                    .on('click', this.onSpellCheckToggle.bind(this) as any);
                this.ui.$footerSpellCheckerItem
                    .on('click', this.onSpellCheckItemClick.bind(this) as any);

                const code = this.normalize(cookie.get<string>('language') ||
                    (navigator.language || 'en-US').replace('-', '_'));
                this.ui.$footerSpellCheckerToggle.find('a')
                    .data('lingua', code);
                this.ui.$footerSpellCheckerToggle.find('a')
                    .data('state', 'off');
                this.ui.$footerSpellCheckerToggle.find('.line2')
                    .text(`Off: Enable [${code.replace('_', '-')}]`);
            });
        }
    }
    private normalize(code: string): string {
        const linguae_all: string[] = this.ui.$footerSpellCheckerMenu.find('>li>a')
            .map((i, li) => $(li).data('lingua'))
            .toArray() as any;
        const linguae_std: string[] = this.ui.$footerSpellCheckerMenu.find('>li>a')
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
        const $menu = this.ui.$footerSpellCheckerMenu;
        $menu.removeClass('disabled');
        const $item = $menu.find('>li');
        $item.fadeIn('slow');
        const $spin = $menu.find('>.spin');
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
    private get ed() {
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default MdEditorFooter;
