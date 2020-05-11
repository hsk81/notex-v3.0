import MdEditor from "./md-editor";

import { cookie } from "../cookie/cookie";
import { trace } from "../decorator/trace";

declare const $: JQueryStatic;
type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
export enum Template {
    Empty = '/static/md/tpl-0-empty.md',
    SingleColumn = '/static/md/tpl-1-column.md',
    DoubleColumn = '/static/md/tpl-2-column.md',
    TripleColumn = '/static/md/tpl-3-column.md'
}
const TemplateClasses = {
    [Template.Empty]: 'empty',
    [Template.SingleColumn]: '1-column',
    [Template.DoubleColumn]: '2-column',
    [Template.TripleColumn]: '3-column'
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
            this.$active.data('url'));
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
    public apply(md: string, pattern = '${MD_CONTENT}') {
        // avoid `String.prototype.replace` due to $$-sign!
        const lhs_index = this.value.indexOf(pattern);
        const lhs = this.value.slice(0, lhs_index);
        const rhs_index = lhs_index + pattern.length;
        const rhs = this.value.slice(rhs_index);
        return lhs + md + rhs;
    }
    public async select(template: Template) {
        this.value = await this.fetch(template);
        this.activateBy(template);
        this.editor.render(true);
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
    private onPrimaryClick() {
        const url = this.$active.data('url');
        this.select(url as Template);
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
        this.activate(this.$item.filter(`.${TemplateClasses[template]}`));
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
        path: string
    ) {
        return await fetch(path).then((res) => {
            return res.ok ? res.text() : Promise.resolve(
                FALLBACK
            );
        }).catch((reason) => {
            console.error(reason);
            return FALLBACK;
        });
    }
    private get value(): string {
        if (this._value === undefined) {
            this._value = FALLBACK;
        }
        return this._value;
    }
    private set value(text: string) {
        this._value = text;
    }
    private _value?: string;
}
const FALLBACK = '${MD_CONTENT}\n'
    + '<script>'
    + 'if (typeof PATCH !== "undefined") PATCH();'
    + '</script>';
export default TemplateManager;
