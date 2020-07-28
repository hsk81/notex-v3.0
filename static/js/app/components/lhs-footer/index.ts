import { LhsEditor } from "../lhs-editor/index";
import { UiMode } from "../lhs-editor/ui-mode";
import * as uiMode from "../lhs-editor/ui-mode";
import { Ui } from "../../ui/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";
import { cookie } from "../../cookie/cookie";

declare const $: JQueryStatic;

@trace
export class LhsFooter {
    public static get me() {
        if (window.LHS_FOOTER === undefined) {
            window.LHS_FOOTER = new LhsFooter();
        }
        return window.LHS_FOOTER;
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
        this.ui.$lhsFooter.fadeIn('slow');
    }
    private hide(force = false) {
        this.ui.$lhs.addClass('without-footer');
        if (force) this.ui.$lhsFooter.hide();
    }
    private events() {
        this.ui.$lhsFooter.find('[data-toggle="popover"]')
            .on('blur', (ev) => $(ev.target).popover('hide'))
            .on('click', (ev) => $(ev.target).popover('toggle'))
            .on('keydown', (ev) => $(ev.target).popover('hide'))
            .on('keypress', (ev) => $(ev.target).popover('hide'));
        this.ui.$lhsFooterSwitch
            .on('click', this.onSwitchClick.bind(this));
        this.ui.$lhsFooterCliFind
            .on('change', this.onFindChange.bind(this) as any);
        this.ui.$lhsFooterCliFind
            .on('keydown', this.onFindKeyDown.bind(this) as any);
        this.ui.$lhsFooterCliFindNext
            .on('click', this.onFindNextClick.bind(this) as any);
        this.ui.$lhsFooterCliFindPrevious
            .on('click', this.onFindPreviousClick.bind(this) as any);
        this.ui.$lhsFooterCliReplace
            .on('change', this.onReplaceChange.bind(this) as any);
        this.ui.$lhsFooterCliReplace
            .on('keydown', this.onReplaceKeyDown.bind(this) as any);
        this.ui.$lhsFooterCliReplaceConfirm
            .on('click', this.onReplaceConfirmClick.bind(this) as any);
        this.ui.$lhsFooterSpellCheckerButton
            .on('click', this.onSpellCheckButtonClick.bind(this) as any);
    }
    private tips() {
        if (this.ed.uiMode === UiMode.simple) {
            this.ui.$lhsFooterSwitch.attr('title', uiMode.text(UiMode.mirror));
        } else {
            this.ui.$lhsFooterSwitch.attr('title', uiMode.text(UiMode.simple));
        }
    }
    private onSwitchClick() {
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
            this.ui.$lhsFooterSwitch.attr('title', uiMode.text(UiMode.mirror))
            this.ui.$lhsFooterCliFind.val('');
            this.hide();
        } else {
            const scroll = {
                left: this.ui.$lhsInput.scrollLeft(),
                top: this.ui.$lhsInput.scrollTop()
            };
            const selection = {
                start: (this.ui.$lhsInput[0] as HTMLInputElement).selectionStart,
                end: (this.ui.$lhsInput[0] as HTMLInputElement).selectionEnd
            };
            const mirror = this.ed.toMirror();
            mirror.focus();
            mirror.scrollTo(scroll.left, scroll.top);
            mirror.setSelection(
                mirror.posFromIndex(selection.start),
                mirror.posFromIndex(selection.end)
            );
            this.ui.$lhsFooterSwitch.attr('title', uiMode.text(UiMode.simple));
            this.ui.$lhsFooterCliFind.val('');
            this.show();
        }
    }
    @buffered(40)
    private onFindKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.ui.$lhsFooterCliFind.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                metaKey: ev.metaKey,
                shiftKey: ev.shiftKey
            });
            this.ui.$lhsFooterCliFind.val('');
        }
        if (ev.key === 'Enter') {
            this.ui.$lhsFooterCliFind.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                metaKey: ev.metaKey,
                shiftKey: ev.shiftKey
            });
        }
    }
    private onFindNextClick(ev: KeyboardEvent) {
        this.ui.$lhsFooterCliFind.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            metaKey: ev.metaKey,
            shiftKey: false
        });
    }
    private onFindPreviousClick(ev: KeyboardEvent) {
        this.ui.$lhsFooterCliFind.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            metaKey: ev.metaKey,
            shiftKey: true
        });
    }
    @buffered(40)
    private onReplaceKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            this.ui.$lhsFooterCliReplace.val('');
        }
        if (ev.key === 'Enter') {
            this.ui.$lhsFooterCliReplace.trigger('change', {
                key: ev.key,
                altKey: ev.altKey,
                ctrlKey: ev.ctrlKey,
                metaKey: ev.metaKey,
                shiftKey: ev.shiftKey
            });
        }
    }
    private onReplaceConfirmClick(ev: KeyboardEvent) {
        this.ui.$lhsFooterCliReplace.trigger('change', {
            key: 'Enter',
            altKey: ev.altKey,
            ctrlKey: ev.ctrlKey,
            metaKey: ev.metaKey,
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
        const $find = this.ui.$lhsFooterCliFind;
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
    private onSpellCheckButtonClick(ev: JQuery.ClickEvent) {
        const menu_url = '/components/lhs-footer/spell-checker/index.html';
        const $menu = this.ui.$lhsFooterSpellCheckerMenu;
        const $spin = $menu.find('>.spin');
        let $item = $menu.find('>li');
        if ($item.length === 0) {
            $.get(menu_url).done((html) => {
                $menu.html(html).append($spin);
                $item = $menu.find('>li').hide();
                $item.find('img').on('load', this.onMenuItemLoad.bind(this));
                const $items = this.ui.$lhsFooterSpellCheckerItem;
                $items.on('click', this.onSpellCheckItemClick.bind(this));
                const $toggle = this.ui.$lhsFooterSpellCheckerToggle;
                $toggle.on('click', this.onSpellCheckToggle.bind(this));
                const language = (navigator.language || 'en-US').replace('-', '_');
                const code = this.normalize(cookie.get('language') || language);
                $toggle.find('a').data('lingua', code);
                $toggle.find('a').data('state', 'off');
                $toggle.find('.line2').text(`Off: Enable [${
                    code.replace('_', '-')
                }]`);
            });
        }
    }
    private onSpellCheckToggle(ev: JQuery.ClickEvent) {
        const $toggle = this.ui.$lhsFooterSpellCheckerToggle;
        const $toggle_a = $toggle.find('a');
        const lingua = {
            charset: 'utf-8', code: this.normalize(cookie.get(
                'language', $toggle_a.data('lingua')
            ))
        };
        const state = $toggle_a.data('state');
        if (state === 'on') {
            this.doSpellCheck('off', lingua);
        } else {
            this.doSpellCheck('on', lingua);
        }
    }
    private onSpellCheckItemClick(ev: JQuery.ClickEvent) {
        const $lii = $(ev.target).closest('li');
        const $lii_a = $lii.find('a');
        this.doSpellCheck('on', {
            charset: $lii_a.data('charset'),
            code: $lii_a.data('lingua')
        });
    }
    private doSpellCheck(new_state: 'on'|'off', lingua: {
        charset: string, code: string
    }) {
        const $toggle = this.ui.$lhsFooterSpellCheckerToggle;
        const $toggle_a = $toggle.find('a');
        const $toggle_img = $toggle.find('img');
        const $toggle_line2 = $toggle.find('.line2');
        const $button = this.ui.$lhsFooterSpellCheckerButton;
        const $button_span = $button.find('span');
        $button.addClass('disabled');
        this.ed.spellCheck({
            charset: lingua.charset,
            code: new_state === 'on' ? lingua.code : null
        }, (
            error: boolean
        ) => {
            if (error || new_state === 'off') {
                $button_span.addClass('glyphicon-eye-close');
                $button_span.removeClass('glyphicon-eye-open');
            } else {
                $button_span.addClass('glyphicon-eye-open');
                $button_span.removeClass('glyphicon-eye-close');
            }
            if (error || new_state === 'off') {
                $toggle_a.data('state', 'off');
                $toggle_img.prop('src', this.urls['32x32'].off);
                $toggle_line2.text(`Off: Enable [${
                    lingua.code.replace('_', '-')
                }]`);
            } else {
                $toggle_a.data('state', 'on');
                $toggle_img.prop('src', this.urls['32x32'].on);
                $toggle_line2.text(`On: Disable [${
                    lingua.code.replace('_', '-')
                }]`);
            }
            if (!error) {
                cookie.set('language', lingua.code)
            }
            $button.removeClass('disabled');
        });
    }
    private normalize(code: string): string {
        const linguae_all: string[] = this.ui.$lhsFooterSpellCheckerMenu.find('>li>a')
            .map((i, li) => $(li).data('lingua'))
            .toArray() as any;
        const linguae_std: string[] = this.ui.$lhsFooterSpellCheckerMenu.find('>li>a')
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
        const $menu = this.ui.$lhsFooterSpellCheckerMenu;
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
        }
    };
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default LhsFooter;
