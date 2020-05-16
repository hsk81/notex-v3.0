import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";

import { MdEditor } from "./md-editor";
import { UiMode } from "./md-editor";

declare const $: JQueryStatic;

export enum AiMode {
    help = 'ai-help',
    none = 'ai-none'
}
@trace
export class MdEditorAibar {
    public static get me(this: any): MdEditorAibar {
        if (this['_me'] === undefined) {
            this['_me'] = window['MD_EDITOR_OVERLAY'] = new MdEditorAibar();
        }
        return this['_me'];
    }
    public constructor() {
        if (this.ed.empty) {
            this.$aibar.find('[data-toggle="tooltip"]').tooltip();
            this.$aibar.find('[data-toggle="popover"]').popover();
            this.$rhs.addClass('with-aibar');
        }
        this.events();
    }
    private events() {
        $(this.ed).on('ui-mode', (ev, { value }) => {
            this.onUiModeChange(value);
        });
        $(this.ed).on('change', (ev) => {
            this.onEditorChange(this.ed.empty);
        });
        $(this.ed).on('ai-mode', (ev, { value }) => {
            this.onAiMode(value);
        });
        $(this.ed).on('ai-page', (ev, { value }) => {
            this.onAiPage(value);
        });
        this.$lhsButton.on(
            'click', this.onLhsButtonClick.bind(this)
        );
        this.$midButton.on(
            'click', this.onMidButtonClick.bind(this)
        );
        this.$rhsButton.on(
            'click', this.onRhsButtonClick.bind(this)
        );
    }
    private onUiModeChange(mode: UiMode) {
        if (this.ed.empty) {
            this.$aibar.fadeIn('slow');
        }
    }
    @buffered(40)
    private onEditorChange(empty: boolean) {
        if (empty || this.aiMode === AiMode.help) {
            this.$rhs.addClass('with-aibar');
        } else {
            this.$rhs.removeClass('with-aibar');
        }
    }
    private async onRhsButtonClick() {
        if (this.aiPage !== undefined && this.aiPage < Infinity) {
            this.aiPage += 1;
        } else {
            this.aiMode = AiMode.help;
        }
    }
    private async onLhsButtonClick() {
        if (this.aiPage !== undefined && this.aiPage > 0) {
            this.aiPage -= 1;
        } else {
            this.aiMode = AiMode.help;
        }
    }
    private async onMidButtonClick() {
        if (this.aiMode !== AiMode.help) {
            this.aiMode = AiMode.help;
        } else {
            this.aiMode = AiMode.none;
        }
    }
    private onAiMode(mode: AiMode) {
        if (mode !== AiMode.help) {
            this.$midButton.text('Help');
        } else {
            this.$midButton.text('Exit');
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
        return window['ai-mode'] as AiMode;
    }
    private set aiMode(value: AiMode) {
        $(this.ed).trigger('ai-mode', {
            value: window['ai-mode'] = value
        });
    }
    private get aiPage() {
        return window['ai-page'] as number | undefined;
    }
    private set aiPage(value: number | undefined) {
        $(this.ed).trigger('ai-page', {
            value: window['ai-page'] = value
        });
    }
    private get $rhs() {
        return $('.rhs');
    }
    private get $aibar() {
        return this.$rhs.find('.aibar');
    }
    private get $lhsButton() {
        return this.$aibar.find('button.ai-lhs');
    }
    private get $midButton() {
        return this.$aibar.find('button.ai-mid');
    }
    private get $rhsButton() {
        return this.$aibar.find('button.ai-rhs');
    }
    private get $viewer() {
        return this.$rhs.find('iframe.viewer');
    }
    private get ed() {
        return MdEditor.me;
    }
}
export default MdEditorAibar;
