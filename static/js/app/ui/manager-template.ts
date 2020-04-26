import MdEditor from "./md-editor";

import { cookie } from "../cookie/cookie";
import { trace } from "../decorator/trace";

type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
declare const $: JQueryStatic;

@trace
export class TemplateManager {
    public static get me(this: any): TemplateManager {
        if (this['_me'] === undefined) {
            this['_me'] = window['TEMPLATE_DIALOG'] = new TemplateManager();
        }
        return this['_me'];
    }
    public constructor() {
        this.$dialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.$dialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.$dialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.$dialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.$item.on(
            'click', this.onItemClick.bind(this));
        this.$primary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    private onBsModalShow() {
    }
    private onBsModalShown() {
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
        this.editor.render(true);
    }
    private async onPrimaryClick() {
        const url = this.$active.data('url');
        const tpl = await this.fetch(url);
        if (typeof tpl === 'string') {
            this.value = tpl;
        }
        this.$dialog.modal('hide');
    }
    private onItemClick(ev: Event) {
        this.$active.removeClass('active');
        const $target = $(ev.target as EventTarget);
        $target.closest('a').addClass('active');
    }
    private get $dialog() {
        return $('#template-dlg');
    }
    private get $item() {
        return this.$dialog.find('a.list-group-item');
    }
    private get $active() {
        return this.$dialog.find('a.list-group-item.active');
    }
    private get $primary() {
        return this.$dialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    private get editor() {
        return MdEditor.me;
    }
    private async fetch(path: string) {
        return await fetch(path).then((res) => {
            return res.ok ? res.text() : Promise.resolve(null);
        }).catch((reason) => {
            console.error(reason);
            return null;
        });
    }
    /**
     * @todo: double $$-signs get reduced to single $-sign; fix!
     */
    public apply(md: string) {
        return this.value.replace(/\${MD_CONTENT}/, md);
    }
    private value = '${MD_CONTENT}\n<script>PATCH()</script>';
}
export default TemplateManager;
