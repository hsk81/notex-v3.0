import { TemplateDialog } from "../dlg-template/index";
import { Alignment } from "../dlg-template/index";
import { FontSize } from "../dlg-template/index";
import { Template } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { AiMode } from "../rhs-footer/ai-mode";
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
        $(this.ed).on(
            'change', (ev) => this.onEditorChange(this.ed.empty));
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
        this.ui.$templateDialog
            .on('select', this.onSelectTemplate.bind(this));
        this.ui.$toolbarFontSizeLarger
            .on('click', this.onFontSizeLargerClick.bind(this));
        this.ui.$toolbarFontSizeSmaller
            .on('click', this.onFontSizeSmallerClick.bind(this));
        this.ui.$templateDialog
            .on('font-size', this.onFontSize.bind(this));
        this.ui.$toolbarAlignLeft
            .on('click', this.onAlignLeftClick.bind(this));
        this.ui.$toolbarAlignCenter
            .on('click', this.onAlignCenterClick.bind(this));
        this.ui.$toolbarAlignRight
            .on('click', this.onAlignRightClick.bind(this));
        this.ui.$toolbarAlignJustifiy
            .on('click', this.onAlignJustifyClick.bind(this));
        this.ui.$templateDialog
            .on('alignment', this.onAlign.bind(this));
        this.ui.$toolbarFigureEnum
            .on('click', this.onFigureEnumClick.bind(this));
        this.ui.$templateDialog
            .on('figure-enum', this.onFigureEnum.bind(this));
        this.ui.$toolbarH1Enum
            .on('click', this.onH1EnumClick.bind(this));
        this.ui.$templateDialog
            .on('h1-enum', this.onH1Enum.bind(this));
        this.ui.$toolbarH2Enum
            .on('click', this.onH2EnumClick.bind(this));
        this.ui.$templateDialog
            .on('h2-enum', this.onH2Enum.bind(this));
        this.ui.$toolbarH3Enum
            .on('click', this.onH3EnumClick.bind(this));
        this.ui.$templateDialog
            .on('h3-enum', this.onH3Enum.bind(this));
    }
    public refresh() {
        this.ed.refresh();
        this.scroll.refresh();
    }
    @buffered(40)
    private onEditorChange(empty: boolean) {
        if (empty || this.aiMode === AiMode.help) {
            this.ui.$rhsToolbar.removeClass('long');
        } else {
            this.ui.$rhsToolbar.addClass('long');
        }
        this.scroll.refresh();
    }
    @buffered
    private onRefreshClick(ev: JQueryEventObject) {
        const $span = this.ui.$toolbarRefresh.find('span');
        setTimeout(() => $span.removeClass('spin'), 600);
        setTimeout(() => $span.addClass('spin'), 0);
        if ((ev.ctrlKey || ev.metaKey)) {
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
        if ((ev.ctrlKey || ev.metaKey)) {
            const $contents = this.ui.$viewer.contents();
            const head = this.template.getHead({ title: this.ed.title });
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
        this.template.select(Template.SingleColumn);
    }
    private onDoubleColumnClick() {
        this.template.select(Template.DoubleColumn);
    }
    private onTripleColumnClick() {
        this.template.select(Template.TripleColumn);
    }
    private onSelectTemplate(ev: JQuery.Event, { template }: {
        template: Template
    }) {
        if (template !== Template.SingleColumn) {
            this.ui.$toolbar1Columns.removeClass('active');
        }
        if (template !== Template.DoubleColumn) {
            this.ui.$toolbar2Columns.removeClass('active');
        }
        if (template !== Template.TripleColumn) {
            this.ui.$toolbar3Columns.removeClass('active');
        }
        switch (template) {
            case Template.SingleColumn:
                this.ui.$toolbar1Columns.addClass('active');
                break;
            case Template.DoubleColumn:
                this.ui.$toolbar2Columns.addClass('active');
                break;
            case Template.TripleColumn:
                this.ui.$toolbar3Columns.addClass('active');
                break;
        }
    }
    @buffered
    private onFontSizeLargerClick() {
        const active = this.ui.$toolbarFontSizeLarger.hasClass('active');
        this.template.fontSize = active ? 'larger' : 'medium';
        this.ed.render();
    }
    @buffered
    private onFontSizeSmallerClick() {
        const active = this.ui.$toolbarFontSizeSmaller.hasClass('active');
        this.template.fontSize = active ? 'smaller' : 'medium';
        this.ed.render();
    }
    private onFontSize(ev: JQuery.Event, { font_size }: {
        font_size: FontSize
    }) {
        if (font_size !== 'smaller') {
            this.ui.$toolbarFontSizeSmaller.removeClass('active');
        }
        if (font_size !== 'larger') {
            this.ui.$toolbarFontSizeLarger.removeClass('active');
        }
        switch (font_size) {
            case 'smaller':
                this.ui.$toolbarFontSizeSmaller.addClass('active');
                break;
            case 'larger':
                this.ui.$toolbarFontSizeLarger.addClass('active');
                break;
        }
    }
    @buffered
    private onAlignLeftClick() {
        this.template.alignment = 'left';
        this.ed.render();
    }
    @buffered
    private onAlignCenterClick() {
        this.template.alignment = 'center';
        this.ed.render();
    }
    @buffered
    private onAlignRightClick() {
        this.template.alignment = 'right';
        this.ed.render();
    }
    @buffered
    private onAlignJustifyClick() {
        this.template.alignment = 'justify';
        this.ed.render();
    }
    private onAlign(ev: JQuery.Event, { alignment }: {
        alignment: Alignment
    }) {
        if (alignment !== 'left') {
            this.ui.$toolbarAlignLeft.removeClass('active');
        }
        if (alignment !== 'center') {
            this.ui.$toolbarAlignCenter.removeClass('active');
        }
        if (alignment !== 'right') {
            this.ui.$toolbarAlignRight.removeClass('active');
        }
        if (alignment !== 'justify') {
            this.ui.$toolbarAlignJustifiy.removeClass('active');
        }
        switch (alignment) {
            case 'left':
                this.ui.$toolbarAlignLeft.addClass('active');
                break;
            case 'center':
                this.ui.$toolbarAlignCenter.addClass('active');
                break;
            case 'right':
                this.ui.$toolbarAlignRight.addClass('active');
                break;
            case 'justify':
                this.ui.$toolbarAlignJustifiy.addClass('active');
                break;
        }
    }
    @buffered
    private onFigureEnumClick() {
        const active = this.ui.$toolbarFigureEnum.hasClass('active');
        this.template.enumFigures = active;
        this.ed.render();
    }
    private onFigureEnum(ev: JQuery.Event, { flag }: {
        flag: boolean
    }) {
        if (flag) {
            this.ui.$toolbarFigureEnum.addClass('active');
        } else {
            this.ui.$toolbarFigureEnum.removeClass('active');
        }
    }
    @buffered
    private onH1EnumClick() {
        this.enumHeadings();
    }
    private onH1Enum(ev: JQuery.Event, { flag }: {
        flag: boolean
    }) {
        if (flag) {
            this.ui.$toolbarH1Enum.addClass('active');
        } else {
            this.ui.$toolbarH1Enum.removeClass('active');
        }
    }
    @buffered
    private onH2EnumClick() {
        this.enumHeadings();
    }
    private onH2Enum(ev: JQuery.Event, { flag }: {
        flag: boolean
    }) {
        if (flag) {
            this.ui.$toolbarH2Enum.addClass('active');
        } else {
            this.ui.$toolbarH2Enum.removeClass('active');
        }
    }
    @buffered
    private onH3EnumClick() {
        this.enumHeadings();
    }
    private onH3Enum(ev: JQuery.Event, { flag }: {
        flag: boolean
    }) {
        if (flag) {
            this.ui.$toolbarH3Enum.addClass('active');
        } else {
            this.ui.$toolbarH3Enum.removeClass('active');
        }
    }
    private enumHeadings() {
        this.template.enumHeaders = {
            h1: this.ui.$toolbarH1Enum.hasClass('active'),
            h2: this.ui.$toolbarH2Enum.hasClass('active'),
            h3: this.ui.$toolbarH3Enum.hasClass('active')
        };
        this.ed.render();
    }
    private get aiMode() {
        return window.AI_MODE as AiMode;
    }
    private get template() {
        return TemplateDialog.me;
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
