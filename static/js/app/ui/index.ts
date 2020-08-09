export type JQueryEx<T = HTMLElement> = Omit<JQuery, 'button'> & {
    button: (action: string) => JQueryEx<T>;
};
export class Ui {
    public static get me(): Ui {
        if (window.UI === undefined) {
            window.UI = new Ui();
        }
        return window.UI;
    }
    public get $document() {
        return $(document);
    }
    public get $header() {
        return $('.header');
    }
    public get $headerOpen() {
        return this.$header.find('#source-bar,#source-mob');
    }
    public get $headerSave() {
        return this.$header.find('a[name=save]');
    }
    public get $headerSwap() {
        return this.$header.find('[name=swap]');
    }
    public get $lhs() {
        return $('.lhs');
    }
    public get $lhsFooter() {
        return this.$lhsInput.siblings('.lhs-footer');
    }
    public get $lhsFooterSwitch() {
        return this.$lhsFooter.find('.glyphicon-transfer').closest('button');
    }
    public get $lhsFooterCli() {
        return this.$lhsFooter.find('#cli');
    }
    public get $lhsFooterCliFind() {
        return this.$lhsFooterCli.find('input.find');
    }
    public get $lhsFooterCliFindNext() {
        return this.$lhsFooterCli.find('.find-next');
    }
    public get $lhsFooterCliFindPrevious() {
        return this.$lhsFooterCli.find('.find-previous');
    }
    public get $lhsFooterCliReplace() {
        return this.$lhsFooterCli.find('input.replace');
    }
    public get $lhsFooterCliReplaceConfirm() {
        return this.$lhsFooterCli.find('.replace-confirm');
    }
    public get $lhsFooterSpellCheckerButton() {
        return this.$lhsFooter.find('#spell-checker-button');
    }
    public get $lhsFooterSpellCheckerMenu() {
        return this.$lhsFooter.find('ul#spell-checker-menu');
    }
    public get $lhsFooterSpellCheckerItem() {
        return this.$lhsFooterSpellCheckerMenu.find('li:not(:first-of-type)');
    }
    public get $lhsFooterSpellCheckerToggle() {
        return this.$lhsFooterSpellCheckerMenu.find('li:first-of-type');
    }
    public get $lhsInput() {
        return this.$lhs.find('#input');
    }
    public get $lhsToolbar() {
        return this.$lhs.find('>.lhs-toolbar');
    }
    public get $lhsToolbarOuter() {
        return this.$lhsToolbar.find('>.toolbar-outer');
    }
    public get $lhsToolbarInner() {
        return this.$lhsToolbarOuter.find('>.toolbar-inner');
    }
    public get $publishDialog() {
        return $('#publish-dlg');
    }
    public get $publishDialogBlogNav() {
        return this.$publishDialog.find('.blog-nav');
    }
    public get $publishDialogBlogTab() {
        return this.$publishDialog.find('#blog-tab');
    }
    public get $publishDialogBlogUrl() {
        return this.$publishDialog.find('#blog-url');
    }
    public get $publishDialogBlogUrlIg() {
        return this.$publishDialogBlogUrl.parent('.input-group');
    }
    public get $publishDialogBlogTitle() {
        return this.$publishDialog.find('#post-title');
    }
    public get $publishDialogBlogTitleIg() {
        return this.$publishDialogBlogTitle.parent('.input-group');
    }
    public get $publishDialogBlogTitleCheckbox() {
        return this.$publishDialogBlogTitleIg.find('[type=checkbox]');
    }
    public get $publishDialogBlogSettings() {
        return this.$publishDialog.find('.post-settings');
    }
    public get $publishDialogBlogSettingsNav() {
        return this.$publishDialog.find('.post-settings.nav');
    }
    public get $publishDialogBlogScripts() {
        return this.$publishDialog.find('.post-settings.scripts');
    }
    public get $publishDialogBlogScriptsNav() {
        return this.$publishDialogBlogSettingsNav.find('.scripts');
    }
    public get $publishDialogBlogScriptsCheckbox() {
        return this.$publishDialogBlogScripts.find('[type=checkbox]');
    }
    public get $publishDialogBlogScriptsTextarea() {
        return this.$publishDialogBlogScripts.find('textarea');
    }
    public get $publishDialogBlogStyles() {
        return this.$publishDialog.find('.post-settings.styles');
    }
    public get $publishDialogBlogStylesNav() {
        return this.$publishDialogBlogSettingsNav.find('.styles');
    }
    public get $publishDialogBlogStylesCheckbox() {
        return this.$publishDialogBlogStyles.find('[type=checkbox]');
    }
    public get $publishDialogBlogStylesTextarea() {
        return this.$publishDialogBlogStyles.find('textarea');
    }
    public get $publishDialogIpfsNav() {
        return this.$publishDialog.find('.ipfs-nav');
    }
    public get $publishDialogIpfsTab() {
        return this.$publishDialog.find('#ipfs-tab');
    }
    public get $publishDialogIpfsGateway() {
        return this.$publishDialog.find('#ipfs-gateway');
    }
    public get $publishDialogIpfsGatewayIg() {
        return this.$publishDialogIpfsGateway.parent('.input-group');
    }
    public get $publishDialogIpfsMetaAuthors() {
        return this.$publishDialog.find('#meta-authors');
    }
    public get $publishDialogIpfsMetaAuthorsIg() {
        return this.$publishDialogIpfsMetaAuthors.parent('.input-group');
    }
    public get $publishDialogIpfsMetaEmails() {
        return this.$publishDialog.find('#meta-emails');
    }
    public get $publishDialogIpfsMetaEmailsIg() {
        return this.$publishDialogIpfsMetaEmails.parent('.input-group');
    }
    public get $publishDialogIpfsMetaTitle() {
        return this.$publishDialog.find('#meta-title');
    }
    public get $publishDialogIpfsMetaTitleIg() {
        return this.$publishDialogIpfsMetaTitle.parent('.input-group');
    }
    public get $publishDialogIpfsMetaDescription() {
        return this.$publishDialog.find('#meta-description');
    }
    public get $publishDialogIpfsMetaDescriptionIg() {
        return this.$publishDialogIpfsMetaDescription.parent('.input-group');
    }
    public get $publishDialogIpfsMetaKeywords() {
        return this.$publishDialog.find('#meta-keywords');
    }
    public get $publishDialogIpfsMetaKeywordsIg() {
        return this.$publishDialogIpfsMetaKeywords.parent('.input-group');
    }
    public get $publishDialogExpand() {
        return this.$publishDialog.find('#expand');
    }
    public get $publishDialogMetamask() {
        return this.$publishDialog.find('#metamask');
    }
    public get $publishDialogMetamaskHelp() {
        return this.$publishDialog.find('#metamask-help');
    }
    public get $publishDialogPrimary() {
        return this.$publishDialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    public get $rhs() {
        return $('.rhs');
    }
    public get $rhsCached() {
        return this.$rhs.find('#cached') as JQuery<HTMLFrameElement>;
    }
    public set $rhsCached($element: JQuery<HTMLFrameElement>) {
        this.$rhsCached.remove();
        this.$rhs.prepend($element);
    }
    public get $rhsCachedBody() {
        return this.$rhsCached.contents().find('body');
    }
    public get $rhsCachedHead() {
        return this.$rhsCached.contents().find('head');
    }
    public get $rhsFooter() {
        return this.$rhs.find('.rhs-footer');
    }
    public get $rhsFooter1stButton() {
        return this.$rhsFooter.find('button.rhs-footer-1st');
    }
    public get $rhsFooter2ndButton() {
        return this.$rhsFooter.find('button.rhs-footer-2nd');
    }
    public get $rhsFooter3rdButton() {
        return this.$rhsFooter.find('button.rhs-footer-3rd');
    }
    public get $rhsOutput() {
        return this.$rhs.find('#output') as JQuery<HTMLFrameElement>;
    }
    public set $rhsOutput($element: JQuery<HTMLFrameElement>) {
        this.$rhsOutput.remove();
        this.$rhs.prepend($element);
    }
    public get $rhsOutputBody() {
        return this.$rhsOutput.contents().find('body');
    }
    public get $rhsOutputHead() {
        return this.$rhsOutput.contents().find('head');
    }
    public get $rhsToolbar() {
        return this.$rhs.find('>.rhs-toolbar');
    }
    public get $rhsToolbarOuter() {
        return this.$rhsToolbar.find('>.toolbar-outer');
    }
    public get $rhsToolbarInner() {
        return this.$rhsToolbarOuter.find('>.toolbar-inner');
    }
    public get $templateDialog() {
        return $('#template-dlg');
    }
    public get $templateDialogItem() {
        return this.$templateDialog.find('a.list-group-item');
    }
    public get $templateDialogItemActive() {
        return this.$templateDialog.find('a.list-group-item.active');
    }
    public get $templateDialogPrimary() {
        return this.$templateDialog.find('.btn-primary') as JQueryEx<HTMLButtonElement>;
    }
    public get $toolbar() {
        return $('.toolbar');
    }
    public get $toolbarOuter() {
        return this.$toolbar.find('>.toolbar-outer');
    }
    public get $toolbarInner() {
        return this.$toolbarOuter.find('>.toolbar-inner');
    }
    public get $toolbarOpen() {
        return this.$toolbarInner.find('#source-bar,#source-mob');
    }
    public get $toolbarSave() {
        return this.$toolbarInner.find('a[name=save]');
    }
    public get $toolbarSwap() {
        return this.$toolbarInner.find('[name=swap]');
    }
    public get $toolbar1Columns() {
        return this.$toolbarInner.find('.1-column').closest('button');
    }
    public get $toolbar2Columns() {
        return this.$toolbarInner.find('.2-column').closest('button');
    }
    public get $toolbar3Columns() {
        return this.$toolbarInner.find('.3-column').closest('button');
    }
    public get $toolbarBold() {
        return this.$toolbarInner.find('.glyphicon-bold').closest('button');
    }
    public get $toolbarCopy() {
        return this.$toolbarInner.find('.glyphicon-copy').closest('button');
    }
    public get $toolbarCut() {
        return this.$toolbarInner.find('.glyphicon-scissors').closest('button');
    }
    public get $toolbarErase() {
        return this.$toolbarInner.find('.glyphicon-erase').closest('button');
    }
    public get $toolbarFont() {
        return this.$toolbarInner.find('.glyphicon-font').closest('button');
    }
    public get $toolbarFontSizeLarger() {
        return this.$toolbarInner.find('.font-size-larger').closest('button');
    }
    public get $toolbarFontSizeSmaller() {
        return this.$toolbarInner.find('.font-size-smaller').closest('button');
    }
    public get $toolbarAlignLeft() {
        return this.$toolbarInner.find('.align-left').closest('button');
    }
    public get $toolbarAlignCenter() {
        return this.$toolbarInner.find('.align-center').closest('button');
    }
    public get $toolbarAlignRight() {
        return this.$toolbarInner.find('.align-right').closest('button');
    }
    public get $toolbarAlignJustifiy() {
        return this.$toolbarInner.find('.align-justify').closest('button');
    }
    public get $toolbarFigureEnum() {
        return this.$toolbarInner.find('.figure-enum').closest('button');
    }
    public get $toolbarH1Enum() {
        return this.$toolbarInner.find('.h1-enum').closest('button');
    }
    public get $toolbarH2Enum() {
        return this.$toolbarInner.find('.h2-enum').closest('button');
    }
    public get $toolbarH3Enum() {
        return this.$toolbarInner.find('.h3-enum').closest('button');
    }
    public get $toolbarHeading() {
        return this.$toolbarInner.find('.glyphicon-header').closest('button');
    }
    public get $toolbarImage() {
        return this.$toolbarInner.find('.glyphicon-picture').closest('button');
    }
    public get $toolbarIndent() {
        return this.$toolbarInner.find('.glyphicon-indent-left').closest('button');
    }
    public get $toolbarItalic() {
        return this.$toolbarInner.find('.glyphicon-italic').closest('button');
    }
    public get $toolbarLink() {
        return this.$toolbarInner.find('.glyphicon-link').closest('button');
    }
    public get $toolbarMathIntegral() {
        return this.$toolbarInner.find('.glyphicon.integral').closest('button');
    }
    public get $toolbarMathProduct() {
        return this.$toolbarInner.find('.glyphicon.product').closest('button');
    }
    public get $toolbarMathSubscript() {
        return this.$toolbarInner.find('.glyphicon-subscript').closest('button');
    }
    public get $toolbarMathSum() {
        return this.$toolbarInner.find('.glyphicon.sum').closest('button');
    }
    public get $toolbarMathSuperscript() {
        return this.$toolbarInner.find('.glyphicon-superscript').closest('button');
    }
    public get $toolbarMathSymbol() {
        return this.$toolbarInner.find('.glyphicon.symbol').closest('button');
    }
    public get $toolbarOutdent() {
        return this.$toolbarInner.find('.glyphicon-indent-right').closest('button');
    }
    public get $toolbarPaste() {
        return this.$toolbarInner.find('.glyphicon-paste').closest('button');
    }
    public get $toolbarPrint() {
        return this.$toolbarInner.find('.glyphicon.print').closest('button');
    }
    public get $toolbarPublish() {
        return this.$toolbarInner.find('.glyphicon.publish').closest('button');
    }
    public get $toolbarRedo() {
        return this.$toolbarInner.find('.glyphicon.redo').closest('button');
    }
    public get $toolbarRefresh() {
        return this.$toolbarInner.find('.glyphicon.refresh').closest('button');
    }
    public get $toolbarLockScrolling() {
        return this.$toolbarInner.find('.glyphicon.lock-scrolling').closest('button');
    }
    public get $toolbarTemplate() {
        return this.$toolbarInner.find('.glyphicon.template').closest('button');
    }
    public get $toolbarUndo() {
        return this.$toolbarInner.find('.glyphicon.undo').closest('button');
    }
    public get $toolbarVideo() {
        return this.$toolbarInner.find('.glyphicon-film').closest('button');
    }
    public get $viewer() {
        if (this.$rhsCached.css('visibility') !== 'hidden') {
            return this.$rhsCached;
        } else {
            return this.$rhsOutput;
        }
    }
    public get $viewerContent() {
        return this.$viewer.contents();
    }
    public get $viewerContentBody() {
        return this.$viewerContent.find('body');
    }
    public get $viewerContentHead() {
        return this.$viewerContent.find('head');
    }
}
export default Ui;
