import { TemplateManager } from "./manager-template";
import { Template } from "./manager-template";
import { MdEditor } from "./md-editor";

import { buffered } from "../decorator/buffered";
import { trace } from "../decorator/trace";

import { IPFS, Buffer } from "../ipfs/index";
import { gateway, html } from "../ipfs/index";
declare const $: JQueryStatic;

@trace
export class MdEditorToolbarRhs {
    public static get me(): MdEditorToolbarRhs {
        if (window.MD_EDITOR_TOOLBAR_RHS === undefined) {
            window.MD_EDITOR_TOOLBAR_RHS = new MdEditorToolbarRhs();
        }
        return window.MD_EDITOR_TOOLBAR_RHS;
    }
    public constructor() {
        if (!this.editor.mobile) {
            this.$outer.fadeIn('slow', () => {
                this.$toolbar.find('[data-toggle="tooltip"]').tooltip();
                this.$toolbar.find('[data-toggle="popover"]').popover();
                this.refresh();
            });
        }
        this.$print
            .on('click', this.onPrintClick.bind(this));
        this.$publish
            .on('click', this.onPublishClick.bind(this));
        this.$refresh
            .on('click', this.onRefreshClick.bind(this));
        this.$template
            .on('click', this.onTemplateClick.bind(this));
        this.$1_column
            .on('click', this.onSingleColumnClick.bind(this));
        this.$2_column
            .on('click', this.onDoubleColumnClick.bind(this));
        this.$3_column
            .on('click', this.onTripleColumnClick.bind(this));
    }
    public refresh() {
        this.editor.refresh();
        this.scroll.refresh();
    }
    @buffered
    private onRefreshClick(ev: JQueryEventObject) {
        const $span = $(ev.target).closest('button').find('span');
        setTimeout(() => $span.removeClass('spin'), 600);
        setTimeout(() => $span.addClass('spin'), 0);
        if (ev.ctrlKey) {
            this.editor.render('hard');
        } else {
            this.editor.render('soft');
        }
    }
    @buffered
    private async onPublishClick(ev: JQueryEventObject) {
        if (ev.ctrlKey) {
            const $contents = this.editor.$viewer.contents();
            const head = TemplateManager.me.head({ title: this.editor.title });
            const body = $contents.find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (const item of ipfs.add(buffer)) {
                    const url = `${gateway.get()}/${item.cid}`;
                    const tab = window.open(url, '_black');
                    if (tab) tab.focus();
                }
            });
        } else {
            $('#publish-dlg').modal();
        }
    }
    private onPrintClick() {
        if (this.editor.$viewer[0].contentWindow) {
            this.editor.$viewer[0].contentWindow.print();
        }
    }
    private onTemplateClick() {
        $('#template-dlg').modal();
    }
    private onSingleColumnClick() {
        TemplateManager.me.select(Template.SingleColumn);
    }
    private onDoubleColumnClick() {
        TemplateManager.me.select(Template.DoubleColumn);
    }
    private onTripleColumnClick() {
        TemplateManager.me.select(Template.TripleColumn);
    }
    private get $outer() {
        return $('.rhs>.toolbar-outer');
    }
    private get $inner() {
        return this.$outer.find('>.toolbar-inner');
    }
    private get $toolbar() {
        return this.$inner.find('>.md-toolbar');
    }
    private get $print() {
        return $('.glyphicon.print').closest('button');
    }
    private get $publish() {
        return $('.glyphicon.publish').closest('button');
    }
    private get $refresh() {
        return $('.glyphicon.refresh').closest('button');
    }
    private get $template() {
        return $('.glyphicon.template').closest('button');
    }
    private get $1_column() {
        return $('.glyphicon.1-column').closest('button');
    }
    private get $2_column() {
        return $('.glyphicon.2-column').closest('button');
    }
    private get $3_column() {
        return $('.glyphicon.3-column').closest('button');
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.$inner[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private get editor() {
        return MdEditor.me;
    }
    private _scroll: any;
}
export default MdEditorToolbarRhs;
