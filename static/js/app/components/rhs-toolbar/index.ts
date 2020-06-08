import { TemplateDialog } from "../dlg-template/index";
import { Template } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/ui";

import { gateway, html } from "../../ipfs/index";
import { IPFS, Buffer } from "../../ipfs/index";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

@trace
export class RhsToolbar {
    public static get me() {
        if (window.RHS_TOOLBAR === undefined) {
            window.RHS_TOOLBAR = new RhsToolbar();
        }
        return window.RHS_TOOLBAR;
    }
    public constructor() {
        if (!this.ed.mobile) {
            this.ui.$rhsToolbar.fadeIn('slow', () => {
                this.refresh();
            });
        }
        this.ui.$toolbarPrint
            .on('click', this.onPrintClick.bind(this));
        this.ui.$toolbarPublish
            .on('click', this.onPublishClick.bind(this));
        this.ui.$toolbarRefresh
            .on('click', this.onRefreshClick.bind(this));
        this.ui.$toolbarTemplate
            .on('click', this.onTemplateClick.bind(this));
        this.ui.$toolbar1Columns
            .on('click', this.onSingleColumnClick.bind(this));
        this.ui.$toolbar2Columns
            .on('click', this.onDoubleColumnClick.bind(this));
        this.ui.$toolbar3Columns
            .on('click', this.onTripleColumnClick.bind(this));
        $(this.ui.$templateDialog)
            .on('select', this.onSelectTemplate.bind(this));
    }
    public refresh() {
        this.ed.refresh();
        this.scroll.refresh();
    }
    @buffered
    private onRefreshClick(ev: JQueryEventObject) {
        const $span = this.ui.$toolbarRefresh.find('span');
        setTimeout(() => $span.removeClass('spin'), 600);
        setTimeout(() => $span.addClass('spin'), 0);
        if (ev.ctrlKey) {
            this.ed.render('hard');
        } else {
            this.ed.render('hard');
        }
    }
    @buffered
    private async onPublishClick(ev: JQueryEventObject) {
        if (ev.ctrlKey) {
            const $contents = this.ui.$viewer.contents();
            const head = TemplateDialog.me.head({ title: this.ed.title });
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
            this.ui.$publishDialog.modal();
        }
    }
    private onPrintClick() {
        if (this.ui.$viewer[0].contentWindow) {
            this.ui.$viewer[0].contentWindow.print();
        }
    }
    private onTemplateClick() {
        this.ui.$templateDialog.modal();
    }
    private onSingleColumnClick() {
        TemplateDialog.me.select(Template.SingleColumn);
    }
    private onDoubleColumnClick() {
        TemplateDialog.me.select(Template.DoubleColumn);
    }
    private onTripleColumnClick() {
        TemplateDialog.me.select(Template.TripleColumn);
    }
    private onSelectTemplate(ev: JQuery.Event, { template }: {
        template: Template
    }) {
        switch (template) {
            case Template.SingleColumn:
                this.ui.$toolbar1Columns.addClass('active');
                this.ui.$toolbar2Columns.removeClass('active');
                this.ui.$toolbar3Columns.removeClass('active');
                break;
            case Template.DoubleColumn:
                this.ui.$toolbar1Columns.removeClass('active');
                this.ui.$toolbar2Columns.addClass('active');
                this.ui.$toolbar3Columns.removeClass('active');
                break;
            case Template.TripleColumn:
                this.ui.$toolbar1Columns.removeClass('active');
                this.ui.$toolbar2Columns.removeClass('active');
                this.ui.$toolbar3Columns.addClass('active');
                break;
            default:
                this.ui.$toolbar1Columns.removeClass('active');
                this.ui.$toolbar2Columns.removeClass('active');
                this.ui.$toolbar3Columns.removeClass('active');
                break;
        }
    }
    private get ed() {
        return LhsEditor.me;
    }
    private get ui() {
        return Ui.me;
    }
    private get scroll(): any {
        if (this._scroll === undefined) {
            this._scroll = new IScroll(this.ui.$rhsToolbarOuter[0], {
                interactiveScrollbars: true,
                mouseWheel: true,
                scrollbars: true
            });
        }
        return this._scroll;
    }
    private _scroll: any;
}
export default RhsToolbar;
