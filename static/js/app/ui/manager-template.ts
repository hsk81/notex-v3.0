import MdEditor from "./md-editor";

import { cookie } from "../cookie/cookie";
import { trace } from "../decorator/trace";

declare const $: JQueryStatic;
type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
export enum Template {
    Empty = 'empty',
    SingleColumn = '1-column',
    DoubleColumn = '2-column',
    TripleColumn = '3-column'
}
const TemplatePath = {
    [Template.Empty]: '/static/html/tpl-0-empty',
    [Template.SingleColumn]: '/static/html/tpl-1-column',
    [Template.DoubleColumn]: '/static/html/tpl-2-column',
    [Template.TripleColumn]: '/static/html/tpl-3-column'
};
@trace
export class TemplateManager {
    public static get me(this: any): TemplateManager {
        if (this['_me'] === undefined) {
            this['_me'] = window['TEMPLATE_DIALOG'] = new TemplateManager();
        }
        return this['_me'];
    }
    public constructor() {
        this.select(
            this.$active.data('tpl') as Template);
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
    public head({ title }: { title?: string } = {}) {
        if (title) {
            return `<title>${title}</title>\n${this.my_head}`;
        }
        return this.my_head;
    }
    public body(md: string, pattern = '${MD_CONTENT}') {
        // avoid `String.prototype.replace` due to $$-sign!
        const lhs_index = this.my_body.indexOf(pattern);
        const lhs = this.my_body.slice(0, lhs_index);
        const rhs_index = lhs_index + pattern.length;
        const rhs = this.my_body.slice(rhs_index);
        return lhs + md + rhs;
    }
    public async select(template: Template) {
        const path = TemplatePath[template];
        this.my_head = await this.fetch(`${path}.head.html`);
        this.my_body = await this.fetch(`${path}.body.html`);
        this.activateBy(template);
        this.editor.render('soft');
    }
    private onBsModalShow() {
    }
    private onBsModalShown() {
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
        this.editor.render('soft');
    }
    private onPrimaryClick() {
        this.select(this.$active.data('tpl') as Template);
        this.$dialog.modal('hide')
    }
    private onItemClick(ev: Event) {
        const $target = $(ev.target as EventTarget);
        this.activate($target);
    }
    private activate($target: JQuery<EventTarget>) {
        this.$active.removeClass('active');
        $target.closest('a').addClass('active');
    }
    private activateBy(template: Template) {
        this.activate(this.$item.filter(function () {
            return $(this).data('tpl') === template;
        }));
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
    private async fetch(
        url: string
    ) {
        return await fetch(url).then((res) => res.text());
    }
    private get my_head(): string {
        if (this._my_head === undefined) {
            this._my_head = HEAD_FALLBACK;
        }
        return this._my_head;
    }
    private set my_head(text: string) {
        this._my_head = text;
    }
    private get my_body(): string {
        if (this._my_body === undefined) {
            this._my_body = BODY_FALLBACK;
        }
        return this._my_body;
    }
    private set my_body(text: string) {
        this._my_body = text;
    }
    private _my_head?: string;
    private _my_body?: string;
}
const HEAD_FALLBACK =
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>';
const BODY_FALLBACK = '${MD_CONTENT}\n'
    + '<script>if (typeof PATCH !== "undefined") PATCH();</script>';
export default TemplateManager;
