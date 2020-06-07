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
    public get $aibar() {
        return this.$rhs.find('.aibar');
    }
    public get $aibarLhsButton() {
        return this.$aibar.find('button.ai-lhs');
    }
    public get $aibarMidButton() {
        return this.$aibar.find('button.ai-mid');
    }
    public get $aibarRhsButton() {
        return this.$aibar.find('button.ai-rhs');
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
        return this.$lhsInput.siblings('.footer');
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
        return this.$lhsToolbarInner.find('>.md-toolbar');
    }
    public get $lhsToolbarInner() {
        return this.$lhsToolbarOuter.find('>.toolbar-inner');
    }
    public get $lhsToolbarOuter() {
        return this.$lhs.find('>.toolbar-outer');
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
    public get $publishDialogBlogUrlInputGroup() {
        return this.$publishDialogBlogUrl.parent('.input-group');
    }
    public get $publishDialogBlogTitle() {
        return this.$publishDialog.find('#post-title');
    }
    public get $publishDialogBlogTitleInputGroup() {
        return this.$publishDialogBlogTitle.parent('.input-group');
    }
    public get $publishDialogBlogTitleCheckbox() {
        return this.$publishDialogBlogTitleInputGroup.find('[type=checkbox]');
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
    public get $publishDialogIpfsGatewayInputGroup() {
        return this.$publishDialogIpfsGateway.parent('.input-group');
    }
    public get $publishDialogExpand() {
        return this.$publishDialog.find('#expand');
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
        return this.$rhsToolbarInner.find('>.md-toolbar');
    }
    public get $rhsToolbarOuter() {
        return this.$rhs.find('>.toolbar-outer');
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
        return this.$toolbarInner.find('>.md-toolbar');
    }
    public get $toolbarInner() {
        return this.$toolbarOuter.find('>.toolbar-inner');
    }
    public get $toolbarOuter() {
        return $('.toolbar-outer');
    }
    public get $toolbarOpen() {
        return this.$toolbar.find('#source-bar,#source-mob');
    }
    public get $toolbarSave() {
        return this.$toolbar.find('a[name=save]');
    }
    public get $toolbarSwap() {
        return this.$toolbar.find('[name=swap]');
    }
    public get $toolbar1Column() {
        return this.$toolbar.find('.glyphicon.1-column').closest('button');
    }
    public get $toolbar2Columns() {
        return this.$toolbar.find('.glyphicon.2-column').closest('button');
    }
    public get $toolbar3Columns() {
        return this.$toolbar.find('.glyphicon.3-column').closest('button');
    }
    public get $toolbarBold() {
        return this.$toolbar.find('.glyphicon-bold').closest('button');
    }
    public get $toolbarCopy() {
        return this.$toolbar.find('.glyphicon-copy').closest('button');
    }
    public get $toolbarCut() {
        return this.$toolbar.find('.glyphicon-scissors').closest('button');
    }
    public get $toolbarErase() {
        return this.$toolbar.find('.glyphicon-erase').closest('button');
    }
    public get $toolbarFont() {
        return this.$toolbar.find('.glyphicon-font').closest('button');
    }
    public get $toolbarHeader() {
        return this.$toolbar.find('.glyphicon-header').closest('button');
    }
    public get $toolbarImage() {
        return this.$toolbar.find('.glyphicon-picture').closest('button');
    }
    public get $toolbarIndent() {
        return this.$toolbar.find('.glyphicon-indent-left').closest('button');
    }
    public get $toolbarItalic() {
        return this.$toolbar.find('.glyphicon-italic').closest('button');
    }
    public get $toolbarLink() {
        return this.$toolbar.find('.glyphicon-link').closest('button');
    }
    public get $toolbarOutdent() {
        return this.$toolbar.find('.glyphicon-indent-right').closest('button');
    }
    public get $toolbarPaste() {
        return this.$toolbar.find('.glyphicon-paste').closest('button');
    }
    public get $toolbarProduct() {
        return this.$toolbar.find('.glyphicon.product').closest('button');
    }
    public get $toolbarPrint() {
        return this.$toolbar.find('.glyphicon.print').closest('button');
    }
    public get $toolbarPublish() {
        return this.$toolbar.find('.glyphicon.publish').closest('button');
    }
    public get $toolbarRedo() {
        return this.$toolbar.find('.glyphicon.redo').closest('button');
    }
    public get $toolbarRefresh() {
        return this.$toolbar.find('.glyphicon.refresh').closest('button');
    }
    public get $toolbarSubscript() {
        return this.$toolbar.find('.glyphicon-subscript').closest('button');
    }
    public get $toolbarSum() {
        return this.$toolbar.find('.glyphicon.sum').closest('button');
    }
    public get $toolbarSupscript() {
        return this.$toolbar.find('.glyphicon-superscript').closest('button');
    }
    public get $toolbarTemplate() {
        return this.$toolbar.find('.glyphicon.template').closest('button');
    }
    public get $toolbarUndo() {
        return this.$toolbar.find('.glyphicon.undo').closest('button');
    }
    public get $toolbarVideo() {
        return this.$toolbar.find('.glyphicon-film').closest('button');
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
