import { trace } from "../../decorator/trace";
import { cookie } from "../../cookie/cookie";
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
    body?: { fontSize?: string },
    figures?: string;
    headings?: string;
    p?: string;
};
class TemplateStyle {
    public toString() {
        let html = '';
        if (this._data.body) {
            if (this._data.body.fontSize) {
                html += `<style>${this._data.body.fontSize}</style>\n`;
            }
        }
        if (this._data.figures) {
            html += `<style>${this._data.figures}</style>\n`;
        }
        if (this._data.headings) {
            html += `<style>${this._data.headings}</style>\n`;
        }
        if (this._data.p) {
            html += `<style>${this._data.p}</style>\n`;
        }
        return html;
    }
    public set data(value: TemplateStyleData) {
        this._data = { ...this._data, ...value };
    }
    private _data: TemplateStyleData = {
        body: {
            fontSize: `body, table { font-size: ${
                'medium'
            }; }`
        },
        figures:
            `figure>figcaption:before { content: ${
                '"Fig. " counter(figures) " – "'
            }; }`,
        headings:
            `h1:before { content: ${'""'}; }` +
            `h2:before { content: ${
                'counter(h2-headings) " "'}; }` +
            `h3:before { content: ${
                'counter(h2-headings) "."' +
                'counter(h3-headings) " "'}; }`,
        p:
            `p, li, figcaption { text-align: ${
                'justify'
            }; }`
    };
}
export type Alignment
    = 'left' | 'center' | 'right' | 'justify';
export type FontSize
    = 'smaller' | 'medium' | 'larger';
@trace
export class TemplateDialog {
    public static get me(): TemplateDialog {
        if (window.TEMPLATE_DIALOG === undefined) {
            window.TEMPLATE_DIALOG = new TemplateDialog();
        }
        return window.TEMPLATE_DIALOG;
    }
    public constructor() {
        this.select(this.template).then(() => {
            const alignment = cookie.get<Alignment>('alignment') ?? 'justify';
            this.alignment = alignment;
            const enum_figures = cookie.get<string>('enum-figures') ?? 'true';
            this.enumFigures = JSON.parse(enum_figures);
            const enum_h1s = cookie.get<string>('enum-h1s') ?? 'false';
            const enum_h2s = cookie.get<string>('enum-h2s') ?? 'true';
            const enum_h3s = cookie.get<string>('enum-h3s') ?? 'true';
            this.enumHeaders = {
                h1: JSON.parse(enum_h1s),
                h2: JSON.parse(enum_h2s),
                h3: JSON.parse(enum_h3s)
            };
            const font_size = cookie.get<FontSize>('font-size') ?? 'medium';
            this.fontSize = font_size;
        });
        this.ui.$templateDialogItem.on(
            'click', this.onItemClick.bind(this));
        this.ui.$templateDialogPrimary.on(
            'click', this.onPrimaryClick.bind(this));
    }
    public async select(template: Template) {
        const path = TemplatePath[template];
        this.head = await this.fetch(`${path}.head.md`);
        this.body = await this.fetch(`${path}.body.md`);
        $(this.ui.$templateDialog).trigger('select', {
            template
        });
        cookie.set('template', template);
        this.activateBy(template);
    }
    public get template() {
        return cookie.get<Template>('template') ?? '1-column' as Template
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
    public set alignment(value: Alignment) {
        this.setStyle({
            p: `p, li, figcaption { text-align: ${value}; }`
        });
        $(this.ui.$templateDialog).trigger('alignment', {
            alignment: value
        });
        cookie.set('alignment', value);
    }
    public set enumFigures(flag: boolean) {
        const before = flag
            ? '"Fig. " counter(figures) " – "'
            : '""';
        this.setStyle({
            figures: `figure>figcaption:before { content: ${before}; }`
        });
        $(this.ui.$templateDialog).trigger('figure-enum', {
            flag
        });
        cookie.set('enum-figures', JSON.stringify(flag));
    }
    public set enumHeaders(flags: {
        h1: boolean, h2: boolean, h3: boolean
    }) {
        const h1_active = flags.h1;
        const h1_before = h1_active
            ? `counter(h1-headings) " "`
            : '""';
        const h2_active = flags.h2;
        const h2_before = h2_active
            ? h1_active
                ? `counter(h1-headings) "."`
                + `counter(h2-headings) " "`
                : `counter(h2-headings) " "`
            : '""';
        const h3_active = flags.h3;
        const h3_before = h3_active
            ? h2_active
                ? h1_active
                    ? `counter(h1-headings) "."`
                    + `counter(h2-headings) "."`
                    + `counter(h3-headings) " "`
                    : `counter(h2-headings) "."`
                    + `counter(h3-headings) " "`
                : h1_active
                    ? `counter(h1-headings) "."`
                    + `counter(h2-headings) "."`
                    + `counter(h3-headings) " "`
                    : `counter(h3-headings) " "`
            : '""';
        this.setStyle({
            headings:
                `h1:before { content: ${h1_before}; }` +
                `h2:before { content: ${h2_before}; }` +
                `h3:before { content: ${h3_before}; }`
        });
        $(this.ui.$templateDialog).trigger('h1-enum', {
            flag: flags.h1
        });
        $(this.ui.$templateDialog).trigger('h2-enum', {
            flag: flags.h2
        });
        $(this.ui.$templateDialog).trigger('h3-enum', {
            flag: flags.h3
        });
        cookie.set('enum-h1s', JSON.stringify(flags.h1));
        cookie.set('enum-h2s', JSON.stringify(flags.h2));
        cookie.set('enum-h3s', JSON.stringify(flags.h3));
    }
    public set fontSize(value: FontSize) {
        this.setStyle({
            body: { fontSize: `body, table { font-size: ${value}; }` }
        });
        $(this.ui.$templateDialog).trigger('font-size', {
            font_size: value
        });
        cookie.set('font-size', value);
    }
    private setStyle(data: TemplateStyleData) {
        this._style.data = data;
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
const BODY_FALLBACK = '${MD_CONTENT}\n' +
    '<script>if (typeof PATCH !== "undefined") PATCH();</script>';
export default TemplateDialog;
