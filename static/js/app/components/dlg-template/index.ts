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
type TemplateStyleData = {
    figures?: string;
    headings?: string
};
class TemplateStyle {
    public toString() {
        let html = '';
        if (this._data.figures) {
            html += `${this._data.figures}\n`;
        }
        if (this._data.headings) {
            html += `${this._data.headings}\n`;
        }
        return html;
    }
    public set data(value: TemplateStyleData) {
        this._data = { ...this._data, ...value };
    }
    private _data: TemplateStyleData = {
        figures: '', headings: ''
    };
}
@trace
export class TemplateDialog {
    public static get me(): TemplateDialog {
        if (window.TEMPLATE_DIALOG === undefined) {
            window.TEMPLATE_DIALOG = new TemplateDialog();
        }
        return window.TEMPLATE_DIALOG;
    }
    public constructor() {
        this.select(
            this.ui.$templateDialogItemActive.data('tpl') as Template);
        this.ui.$templateDialogItem.on(
            'click', this.onItemClick.bind(this));
        this.ui.$templateDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    public getHead({ title }: { title?: string } = {}) {
        if (title) {
            return `<title>${title}</title>\n${this.head}`;
        }
        return this.head;
    }
    public getBody(md: string, pattern = '${MD_CONTENT}') {
        // avoid `String.prototype.replace` due to $$-sign!
        const lhs_index = this.body.indexOf(pattern);
        const lhs = this.body.slice(0, lhs_index);
        const rhs_index = lhs_index + pattern.length;
        const rhs = this.body.slice(rhs_index);
        return `${lhs}${this._style}${md}${rhs}`;
    }
    public setStyle(value: TemplateStyleData) {
        this._style.data = value;
    }
    public async select(template: Template) {
        const path = TemplatePath[template];
        this.head = await this.fetch(`${path}.head.md`);
        this.body = await this.fetch(`${path}.body.md`);
        $(this.ui.$templateDialog).trigger('select', {
            template
        });
        this.activateBy(template);
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
    private get head() {
        if (this._head === undefined) {
            this._head = HEAD_FALLBACK;
        }
        return this._head;
    }
    private set head(text: string) {
        this._head = text;
    }
    private get body() {
        if (this._body === undefined) {
            this._body = BODY_FALLBACK;
        }
        return this._body;
    }
    private set body(text: string) {
        this._body = text;
    }
    private get ui() {
        return Ui.me;
    }
    private _head?: string;
    private _body?: string;
    private _style = new TemplateStyle();
}
const HEAD_FALLBACK =
    '<meta name="viewport" content="width=device-width,initial-scale=1"/>';
const BODY_FALLBACK = '${MD_CONTENT}\n'
    + '<script>if (typeof PATCH !== "undefined") PATCH();</script>';
export default TemplateDialog;
