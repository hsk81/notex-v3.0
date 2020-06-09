import { trace } from "../../decorator/trace";
import { Ui } from "../../ui/index";
declare const $: JQueryStatic;

export enum Template {
    Empty = 'empty',
    SingleColumn = '1-column',
    DoubleColumn = '2-column',
    TripleColumn = '3-column'
}
const TemplatePath = {
    [Template.Empty]: '/static/tpl/0-empty',
    [Template.SingleColumn]: '/static/tpl/1-column',
    [Template.DoubleColumn]: '/static/tpl/2-column',
    [Template.TripleColumn]: '/static/tpl/3-column'
};
/**
 * @todo: extract template management!
 */
@trace
export class TemplateDialog {
    public static get me() {
        if (window.TEMPLATE_DIALOG === undefined) {
            window.TEMPLATE_DIALOG = new TemplateDialog();
        }
        return window.TEMPLATE_DIALOG;
    }
    public constructor() {
        this.select(
            this.ui.$templateDialogItemActive.data('tpl') as Template);
        this.ui.$templateDialog.on(
            'show.bs.modal', this.onBsModalShow.bind(this));
        this.ui.$templateDialog.on(
            'shown.bs.modal', this.onBsModalShown.bind(this));
        this.ui.$templateDialog.on(
            'hide.bs.modal', this.onBsModalHide.bind(this));
        this.ui.$templateDialog.on(
            'hidden.bs.modal', this.onBsModalHidden.bind(this));
        this.ui.$templateDialogItem.on(
            'click', this.onItemClick.bind(this));
        this.ui.$templateDialogPrimary.on(
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
        this.my_head = await this.fetch(`${path}.head.md`);
        this.my_body = await this.fetch(`${path}.body.md`);
        $(this.ui.$templateDialog).trigger('select', {
            template
        });
        this.activateBy(template);
    }
    private onBsModalShow() {
    }
    private onBsModalShown() {
    }
    private onBsModalHide() {
    }
    private onBsModalHidden() {
    }
    private onPrimaryClick() {
        this.select(this.ui.$templateDialogItemActive.data('tpl') as Template);
        this.ui.$templateDialog.modal('hide')
    }
    private onItemClick(ev: Event) {
        const $target = $(ev.target as EventTarget);
        this.activate($target);
    }
    private activate($target: JQuery<EventTarget>) {
        this.ui.$templateDialogItemActive.removeClass('active');
        $target.closest('a').addClass('active');
    }
    private activateBy(template: Template) {
        this.activate(this.ui.$templateDialogItem.filter(function () {
            return $(this).data('tpl') === template;
        }));
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
    private get ui() {
        return Ui.me;
    }
    private _my_head?: string;
    private _my_body?: string;
}
const HEAD_FALLBACK =
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>';
const BODY_FALLBACK = '${MD_CONTENT}\n'
    + '<script>if (typeof PATCH !== "undefined") PATCH();</script>';
export default TemplateDialog;
