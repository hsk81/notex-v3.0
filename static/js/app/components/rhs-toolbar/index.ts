import { TemplateDialog } from "../dlg-template/index";
import { Template } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { Ui } from "../../ui/index";

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
        this.ui.$toolbarPublish
            .on('click', this.onPublishClick.bind(this));
        this.ui.$toolbarPrint
            .on('click', this.onPrintClick.bind(this));
        this.ui.$toolbarRefresh
            .on('click', this.onRefreshClick.bind(this));
        this.ui.$toolbarLockScrolling
            .on('click', this.onLockScrollingClick.bind(this));
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
        this.ui.$toolbarFigureEnum
            .on('click', this.onFigureEnumClick.bind(this));
        this.ui.$toolbarH1Enum
            .on('click', this.onH1EnumClick.bind(this));
        this.ui.$toolbarH2Enum
            .on('click', this.onH2EnumClick.bind(this));
        this.ui.$toolbarH3Enum
            .on('click', this.onH3EnumClick.bind(this));
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
            this.ed.render('soft');
        }
    }
    @buffered
    private onLockScrollingClick() {
        const $button = this.ui.$toolbarLockScrolling;
        const active = $button.hasClass('active');
        if (active) {
            $button.prop('title', 'Unlock Scrolling');
        } else {
            $button.prop('title', 'Lock Scrolling');
        }
        this.ed.lockScroll = active;
    }
    @buffered
    private async onPublishClick(ev: JQueryEventObject) {
        if (ev.ctrlKey) {
            const $contents = this.ui.$viewer.contents();
            const head = TemplateDialog.me.getHead({ title: this.ed.title });
            const body = $contents.find('body').html();
            const buffer = Buffer.from(await html(head, body));
            IPFS.me(async (ipfs: any) => {
                for await (const item of ipfs.add(buffer)) {
                    const url = `${gateway.get()}/${item.cid}`;
                    const tab = window.open(url, '_same');
                    if (tab && tab.focus) tab.focus();
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
    @buffered
    private onFigureEnumClick() {
        this.enumFigures();
    }
    @buffered
    private onH1EnumClick() {
        this.enumHeadings();
    }
    @buffered
    private onH2EnumClick() {
        this.enumHeadings();
    }
    @buffered
    private onH3EnumClick() {
        this.enumHeadings();
    }
    private enumFigures() {
        const active = this.ui.$toolbarFigureEnum.hasClass('active');
        const before = active
            ? '"Fig. " counter(figures) " – "'
            : '""';
        TemplateDialog.me.setStyle({
            figures: `<style>`
                + `figure>figcaption:before { content: ${before}; }`
                + `</style>`
        });
        this.ed.render('soft');
    }
    private enumHeadings() {
        const h1_active = this.ui.$toolbarH1Enum.hasClass('active');
        const h1_before = h1_active
            ? `counter(h1-headings) " "`
            : '""';
        const h2_active = this.ui.$toolbarH2Enum.hasClass('active');
        const h2_before = h2_active
            ? h1_active
                ? `counter(h1-headings) "."`
                + `counter(h2-headings) " "`
                : `counter(h2-headings) " "`
            : '""';
        const h3_active = this.ui.$toolbarH3Enum.hasClass('active');
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
        TemplateDialog.me.setStyle({
            headings: `<style>`
              + `h1:before { content: ${h1_before}; }`
              + `h2:before { content: ${h2_before}; }`
              + `h3:before { content: ${h3_before}; }`
              + `</style>`
        });
        this.ed.render('soft');
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
