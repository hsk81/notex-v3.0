import { MdEditor } from "./md-editor";
import { AiMode } from "./ai-mode";
import { UiMode } from "./ui-mode";
import { Ui } from "./ui";

import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";

declare const $: JQueryStatic;

@trace
export class MdEditorAibar {
    public static get me() {
        if (window.MD_EDITOR_AIBAR === undefined) {
            window.MD_EDITOR_AIBAR = new MdEditorAibar();
        }
        return window.MD_EDITOR_AIBAR;
    }
    public constructor() {
        if (this.ed.empty) {
            this.show();
        } else {
            this.hide();
        }
        this.events();
        this.tips();
    }
    private show() {
        this.ui.$aibar.fadeIn('slow', () => {
            this.ui.$rhs.addClass('with-aibar');
            this.ui.$aibar.removeAttr('style');
        });
    }
    private hide() {
        this.ui.$rhs.removeClass('with-aibar');
    }
    private tips() {
        this.ui.$aibar.find('[data-toggle="tooltip"]').tooltip();
        this.ui.$aibar.find('[data-toggle="popover"]').popover();
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
        this.ui.$aibarLhsButton.on(
            'click', this.onLhsButtonClick.bind(this));
        this.ui.$aibarMidButton.on(
            'click', this.onMidButtonClick.bind(this));
        this.ui.$aibarRhsButton.on(
            'click', this.onRhsButtonClick.bind(this));
    }
    private onUiModeChange(mode: UiMode) {
        if (this.ed.empty) {
            this.ui.$aibar.fadeIn('slow');
        }
    }
    @buffered(40)
    private onEditorChange(empty: boolean) {
        if (empty || this.aiMode === AiMode.help) {
            this.ui.$rhs.addClass('with-aibar');
        } else {
            this.ui.$rhs.removeClass('with-aibar');
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
            this.ui.$aibarMidButton.text('Help');
        } else {
            this.ui.$aibarMidButton.text('Exit');
        }
        if (mode !== AiMode.help) {
            this.aiPage = undefined;
        } else {
            this.aiPage = 0;
        }
    }
    private async onAiPage(page: number | undefined) {
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
        return MdEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
}
export default MdEditorAibar;
