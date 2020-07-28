import { LhsEditor } from "../lhs-editor/index";
import { AiMode } from "./ai-mode";
import { UiMode } from "../lhs-editor/ui-mode";
import { Ui } from "../../ui/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

declare const $: JQueryStatic;

@trace
export class RhsFooter {
    public static get me(): RhsFooter {
        if (window.RHS_FOOTER === undefined) {
            window.RHS_FOOTER = new RhsFooter();
        }
        return window.RHS_FOOTER;
    }
    public constructor() {
        if (this.ed.empty) {
            this.show();
        } else {
            this.hide();
        }
        this.events();
    }
    private show() {
        this.ui.$rhsFooter.fadeIn('slow', () => {
            this.ui.$rhs.addClass('with-footer');
            this.ui.$rhsFooter.removeAttr('style');
        });
    }
    private hide() {
        this.ui.$rhs.removeClass('with-footer');
    }
    private events() {
        $(this.ed).on(
            'ui-mode', (ev, { value }) => this.onUiModeChange(value));
        $(this.ed).on(
            'change', (ev) => this.onEditorChange(this.ed.empty));
        $(this.ed).on(
            'ai-mode', (ev, { value }) => this.onAiMode(value));
        $(this.ed).on(
            'ai-page', (ev, { value }) => this.onAiPage(value));
        this.ui.$rhsFooter1stButton.on(
            'click', this.onLhsButtonClick.bind(this));
        this.ui.$rhsFooter2ndButton.on(
            'click', this.onMidButtonClick.bind(this));
        this.ui.$rhsFooter3rdButton.on(
            'click', this.onRhsButtonClick.bind(this));
    }
    private onUiModeChange(mode: UiMode) {
        if (this.ed.empty) {
            this.ui.$rhsFooter.fadeIn('slow');
        }
    }
    @buffered(40)
    private onEditorChange(empty: boolean) {
        if (empty || this.aiMode === AiMode.help) {
            this.ui.$rhs.addClass('with-footer');
        } else {
            this.ui.$rhs.removeClass('with-footer');
        }
    }
    private onRhsButtonClick() {
        if (this.aiPage !== undefined && this.aiPage < Infinity) {
            this.aiPage += 1;
        } else {
            this.aiMode = AiMode.help;
        }
        this.ed.doScroll(0);
    }
    private onLhsButtonClick() {
        if (this.aiPage !== undefined && this.aiPage > 0) {
            this.aiPage -= 1;
        } else {
            this.aiMode = AiMode.help;
        }
        this.ed.doScroll(0);
    }
    private onMidButtonClick() {
        if (this.aiMode !== AiMode.help) {
            this.aiMode = AiMode.help;
        } else {
            this.aiMode = AiMode.none;
        }
    }
    private onAiMode(mode: AiMode) {
        if (mode !== AiMode.help) {
            this.ui.$rhsFooter2ndButton.text('Help');
        } else {
            this.ui.$rhsFooter2ndButton.text('Exit');
        }
        if (mode !== AiMode.help) {
            this.aiPage = undefined;
        } else {
            this.aiPage = 0;
        }
    }
    private async onAiPage(page: number|undefined) {
        if (page !== undefined) {
            const help = await this.fetch(page);
            if (help !== null) {
                this.ed.setValue(help);
            } else {
                this.aiMode = AiMode.none;
            }
        } else {
            this.ed.clear();
        }
    }
    private async fetch(page: number) {
        const padded = page.toString(16).padStart(4, '0');
        const path = `/static/md/help-${padded.toUpperCase()}.md`;
        return await fetch(path)
            .then((res) => {
                return res.ok ? res.text() : Promise.resolve(null);
            })
            .catch((reason) => {
                return null;
            });
    }
    private get aiMode() {
        return window.AI_MODE as AiMode;
    }
    private set aiMode(value: AiMode) {
        $(this.ed).trigger('ai-mode', {
            value: window.AI_MODE = value
        });
    }
    private get aiPage() {
        return window.AI_PAGE as number|undefined;
    }
    private set aiPage(value: number|undefined) {
        $(this.ed).trigger('ai-page', {
            value: window.AI_PAGE = value
        });
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default RhsFooter;
