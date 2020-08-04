import { Alignment } from "../dlg-template/index";
import { FontSize } from "../dlg-template/index";
import { Template } from "../dlg-template/index";
import { LhsEditor } from "../lhs-editor/index";
import { AiMode } from "../rhs-footer/ai-mode";
import { Ui } from "../../ui/index";

import { Commands } from "../../commands/index";
import { AlignText } from "../../commands/align-text";
import { EnumFigures } from "../../commands/enum-figures";
import { EnumHeadings } from "../../commands/enum-headings";
import { LargerFontSize } from "../../commands/larger-font-size";
import { LockScrolling } from "../../commands/lock-scrolling";
import { PrintFile } from "../../commands/print-file";
import { PublishBlog } from "../../commands/publish-blog";
import { RefreshView } from "../../commands/refresh-view";
import { SelectTemplate } from "../../commands/select-template";
import { SmallerFontSize } from "../../commands/smaller-font-size";

import { buffered } from "../../decorator/buffered";
import { trace } from "../../decorator/trace";

@trace
export class RhsToolbar {
    public static get me(): RhsToolbar {
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
        Commands.me.run(new RefreshView(ev));
    }
    @buffered
    private onLockScrollingClick() {
        Commands.me.run(new LockScrolling());
    }
    @buffered
    private onPublishClick(ev: JQueryEventObject) {
        Commands.me.run(new PublishBlog(ev));
    }
    private onPrintClick() {
        Commands.me.run(new PrintFile());
    }
    private onTemplateClick() {
        Commands.me.run(new SelectTemplate());
    }
    private onSingleColumnClick() {
        Commands.me.run(new SelectTemplate(Template.SingleColumn));
    }
    private onDoubleColumnClick() {
        Commands.me.run(new SelectTemplate(Template.DoubleColumn));
    }
    private onTripleColumnClick() {
        Commands.me.run(new SelectTemplate(Template.TripleColumn));
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
        Commands.me.run(new LargerFontSize());
    }
    @buffered
    private onFontSizeSmallerClick() {
        Commands.me.run(new SmallerFontSize());
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
        Commands.me.run(new AlignText('left'));
    }
    @buffered
    private onAlignCenterClick() {
        Commands.me.run(new AlignText('center'));
    }
    @buffered
    private onAlignRightClick() {
        Commands.me.run(new AlignText('right'));
    }
    @buffered
    private onAlignJustifyClick() {
        Commands.me.run(new AlignText('justify'));
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
        Commands.me.run(new EnumFigures());
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
        Commands.me.run(new EnumHeadings());
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
        Commands.me.run(new EnumHeadings());
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
        Commands.me.run(new EnumHeadings());
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
    private get aiMode() {
        return window.AI_MODE as AiMode;
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
